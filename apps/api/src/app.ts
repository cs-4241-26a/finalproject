import {
    randomBytes,
    scrypt,
    timingSafeEqual,
} from "node:crypto";
import connectPgSimple from "connect-pg-simple";
import express, {
    type ErrorRequestHandler,
    type NextFunction,
    type Request,
    type Response,
} from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Pool, QueryResultRow } from "pg";

const USERNAME_PATTERN = /^[a-z0-9_]{3,32}$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const HASH_BYTES = 32;

interface Account extends QueryResultRow {
    id: string;
    username: string;
    password_salt: Buffer;
    password_hash: Buffer;
    session_version: number;
    created_at: Date;
}

interface SerializedAccount {
    accountId: string;
    sessionVersion: number;
}

declare global {
    namespace Express {
        interface User extends Account {}
    }
}

function normalizeUsername(value: unknown) {
    if (typeof value !== "string") return null;
    const username = value.toLowerCase();
    return USERNAME_PATTERN.test(username)
        ? username
        : null;
}

function validPassword(value: unknown): value is string {
    return (
        typeof value === "string" &&
        value.length >= PASSWORD_MIN_LENGTH &&
        value.length <= PASSWORD_MAX_LENGTH
    );
}

function derivePassword(password: string, salt: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
        scrypt(password, salt, HASH_BYTES, (error, key) =>
            error ? reject(error) : resolve(key as Buffer),
        );
    });
}

async function hashPassword(password: string) {
    const salt = randomBytes(16);
    return {
        salt,
        hash: await derivePassword(password, salt),
    };
}

async function passwordMatches(
    password: string,
    account: Account,
) {
    const candidate = await derivePassword(
        password,
        account.password_salt,
    );
    return timingSafeEqual(
        candidate,
        account.password_hash,
    );
}

function publicAccount(account: Account) {
    return {
        id: account.id,
        username: account.username,
        createdAt: account.created_at.toISOString(),
    };
}

function isUniqueViolation(error: unknown) {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
    );
}

function logIn(request: Request, account: Account) {
    return new Promise<void>((resolve, reject) => {
        request.logIn(account, (error) =>
            error ? reject(error) : resolve(),
        );
    });
}

function destroySession(request: Request) {
    return new Promise<void>((resolve, reject) => {
        request.session.destroy((error) =>
            error ? reject(error) : resolve(),
        );
    });
}

function requireAccount(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    if (!request.user) {
        response
            .status(401)
            .json({ error: "authentication_required" });
        return;
    }
    next();
}

export function createApp(
    pool: Pool,
    sessionSecret: string,
    secureCookies = false,
) {
    const app = express();
    const auth = new passport.Passport();
    const PgStore = connectPgSimple(session);

    if (secureCookies) app.set("trust proxy", 1);

    app.use(
        express.json({
            limit: "2kb",
            type: "application/json",
        }),
    );
    app.use(
        session({
            name: "sid",
            store: new PgStore({ pool }),
            secret: sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                sameSite: "lax",
                secure: secureCookies,
                maxAge: SESSION_MAX_AGE,
            },
        }),
    );

    auth.use(
        new LocalStrategy(
            async (username, password, done) => {
                try {
                    const normalized =
                        normalizeUsername(username);
                    if (
                        !normalized ||
                        !validPassword(password)
                    )
                        return done(null, false);

                    const result =
                        await pool.query<Account>(
                            "SELECT id, username, password_salt, password_hash, session_version, created_at FROM accounts WHERE username = $1",
                            [normalized],
                        );
                    const account = result.rows[0];
                    if (
                        !account ||
                        !(await passwordMatches(
                            password,
                            account,
                        ))
                    )
                        return done(null, false);
                    done(null, account);
                } catch (error) {
                    done(error);
                }
            },
        ),
    );

    auth.serializeUser<SerializedAccount>(
        (account, done) => {
            done(null, {
                accountId: account.id,
                sessionVersion: account.session_version,
            });
        },
    );

    auth.deserializeUser<SerializedAccount>(
        async (serialized, done) => {
            try {
                const result = await pool.query<Account>(
                    "SELECT id, username, password_salt, password_hash, session_version, created_at FROM accounts WHERE id = $1 AND session_version = $2",
                    [
                        serialized.accountId,
                        serialized.sessionVersion,
                    ],
                );
                done(null, result.rows[0] ?? false);
            } catch (error) {
                done(error);
            }
        },
    );

    app.use(auth.initialize());
    app.use(auth.session());

    app.get("/api/health", (_request, response) => {
        response.json({ status: "ok" });
    });

    app.post("/api/register", async (request, response) => {
        const username = normalizeUsername(
            request.body?.username,
        );
        const password = request.body?.password;
        if (!username || !validPassword(password)) {
            response
                .status(400)
                .json({ error: "invalid_credentials" });
            return;
        }

        const { salt, hash } = await hashPassword(password);
        try {
            const result = await pool.query<Account>(
                `INSERT INTO accounts (username, password_salt, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, username, password_salt, password_hash, session_version, created_at`,
                [username, salt, hash],
            );
            const account = result.rows[0]!;
            await logIn(request, account);
            response
                .status(201)
                .json({ user: publicAccount(account) });
        } catch (error) {
            if (isUniqueViolation(error)) {
                response
                    .status(409)
                    .json({ error: "username_taken" });
                return;
            }
            throw error;
        }
    });

    app.post("/api/login", (request, response, next) => {
        const username = normalizeUsername(
            request.body?.username,
        );
        const password = request.body?.password;
        if (!username || !validPassword(password)) {
            response
                .status(400)
                .json({ error: "invalid_credentials" });
            return;
        }

        auth.authenticate(
            "local",
            async (
                error: unknown,
                account: Express.User | false,
            ) => {
                try {
                    if (error) throw error;
                    if (!account) {
                        response
                            .status(401)
                            .json({
                                error: "invalid_credentials",
                            });
                        return;
                    }
                    await logIn(request, account);
                    response.json({
                        user: publicAccount(account),
                    });
                } catch (authenticationError) {
                    next(authenticationError);
                }
            },
        )(request, response, next);
    });

    app.post("/api/logout", async (request, response) => {
        await destroySession(request);
        response.clearCookie("sid", {
            httpOnly: true,
            sameSite: "lax",
            secure: secureCookies,
        });
        response.sendStatus(204);
    });

    app.get(
        "/api/me",
        requireAccount,
        (request, response) => {
            response.json({
                user: publicAccount(request.user!),
            });
        },
    );

    app.patch(
        "/api/me",
        requireAccount,
        async (request, response) => {
            const username = normalizeUsername(
                request.body?.username,
            );
            if (!username) {
                response
                    .status(400)
                    .json({ error: "invalid_username" });
                return;
            }

            try {
                const result = await pool.query<Account>(
                    `UPDATE accounts SET username = $1, updated_at = now() WHERE id = $2
         RETURNING id, username, password_salt, password_hash, session_version, created_at`,
                    [username, request.user!.id],
                );
                response.json({
                    user: publicAccount(result.rows[0]!),
                });
            } catch (error) {
                if (isUniqueViolation(error)) {
                    response
                        .status(409)
                        .json({ error: "username_taken" });
                    return;
                }
                throw error;
            }
        },
    );

    app.patch(
        "/api/me/password",
        requireAccount,
        async (request, response) => {
            const currentPassword =
                request.body?.currentPassword;
            const newPassword = request.body?.newPassword;
            if (
                !validPassword(currentPassword) ||
                !validPassword(newPassword)
            ) {
                response
                    .status(400)
                    .json({ error: "invalid_password" });
                return;
            }
            if (
                !(await passwordMatches(
                    currentPassword,
                    request.user!,
                ))
            ) {
                response
                    .status(401)
                    .json({ error: "invalid_credentials" });
                return;
            }

            const { salt, hash } =
                await hashPassword(newPassword);
            const result = await pool.query<Account>(
                `UPDATE accounts
       SET password_salt = $1, password_hash = $2, session_version = session_version + 1, updated_at = now()
       WHERE id = $3
       RETURNING id, username, password_salt, password_hash, session_version, created_at`,
                [salt, hash, request.user!.id],
            );
            await logIn(request, result.rows[0]!);
            response.sendStatus(204);
        },
    );

    app.delete(
        "/api/me",
        requireAccount,
        async (request, response) => {
            const password = request.body?.password;
            if (!validPassword(password)) {
                response
                    .status(400)
                    .json({ error: "invalid_password" });
                return;
            }
            if (
                !(await passwordMatches(
                    password,
                    request.user!,
                ))
            ) {
                response
                    .status(401)
                    .json({ error: "invalid_credentials" });
                return;
            }

            await pool.query(
                "DELETE FROM accounts WHERE id = $1",
                [request.user!.id],
            );
            try {
                await destroySession(request);
            } finally {
                response.clearCookie("sid", {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: secureCookies,
                });
            }
            response.sendStatus(204);
        },
    );

    const errorHandler: ErrorRequestHandler = (
        error,
        _request,
        response,
        _next,
    ) => {
        if (
            typeof error === "object" &&
            error !== null &&
            "type" in error &&
            error.type === "entity.parse.failed"
        ) {
            response
                .status(400)
                .json({ error: "invalid_json" });
            return;
        }
        console.error(error);
        response
            .status(500)
            .json({ error: "internal_server_error" });
    };
    app.use(errorHandler);

    return app;
}
