import express, {
    type ErrorRequestHandler,
    type NextFunction,
    type Request,
    type Response,
    type Express,
} from "express";
import passport from "passport";
import fs from "fs";
import path from "path";
import type { Pool } from "pg";
import { fileURLToPath } from "url";

const levelsDir = fileURLToPath(
    new URL("../levels", import.meta.url),
);
const levels = JSON.parse(
    fs.readFileSync(
        new URL("../levels/levels.json", import.meta.url),
        "utf8",
    ),
);

interface GameSession {
    round: number;
    totalScore: number;
    currentLevelIndex: number;
    history: {
        levelName: string;
        distance: number;
        score: number;
    }[];
    completed: boolean;
}

const activeGames = new Map<string, GameSession>();

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function setupGameEndpoints(
    app: Express,
    pool: Pool,
) {
    app.get(
        "/api/game/state",
        (req: Request, res: Response) => {
            if (!req.user)
                return res
                    .status(401)
                    .send("not logged in");
            const game = activeGames.get(req.user.id);
            if (!game) return res.json({ active: false });
            res.json({ active: true, ...game });
        },
    );

    app.post(
        "/api/game/start",
        (req: Request, res: Response) => {
            if (!req.user)
                return res
                    .status(401)
                    .send("not logged in");
            const newGame: GameSession = {
                round: 1,
                totalScore: 0,
                currentLevelIndex: getRandomInt(
                    levels.length,
                ),
                history: [],
                completed: false,
            };
            activeGames.set(req.user.id, newGame);
            res.json({ active: true, ...newGame });
        },
    );

    app.get(
        "/api/game/image",
        (req: Request, res: Response) => {
            if (!req.user)
                return res
                    .status(401)
                    .send("not logged in");
            const game = activeGames.get(req.user.id);
            if (!game || game.completed)
                return res
                    .status(404)
                    .send("no game active");
            const pathStr =
                levels[game.currentLevelIndex].name.concat(
                    ".webp",
                );
            res.sendFile(pathStr, { root: levelsDir });
        },
    );

    app.post(
        "/api/game/guess",
        async (req: Request, res: Response) => {
            if (!req.user)
                return res
                    .status(401)
                    .send("not logged in");
            const game = activeGames.get(req.user.id);
            if (!game || game.completed)
                return res
                    .status(404)
                    .send("no game active");

            const level = levels[game.currentLevelIndex];
            const guessX = req.body.xPosition;
            const guessY = req.body.yPosition;

            const distance = Math.sqrt(
                (guessX - level.mapX) ** 2 +
                    (guessY - level.mapY) ** 2,
            );

            let score = 0;
            if (distance <= 25) {
                score = 5000;
            } else {
                score =
                    5000 * Math.exp(-(distance - 25) / 320);
            }
            score = Math.max(0, Math.round(score));

            game.history.push({
                levelName: level.name,
                distance,
                score,
            });
            game.totalScore += score;

            if (game.round >= 5) {
                game.completed = true;
                await pool.query(
                    "INSERT INTO games (account_id, score) VALUES ($1, $2)",
                    [req.user.id, game.totalScore],
                );
                res.json({
                    completed: true,
                    history: game.history,
                    totalScore: game.totalScore,
                    roundScore: score,
                });
                activeGames.delete(req.user.id);
            } else {
                game.round += 1;
                game.currentLevelIndex = getRandomInt(
                    levels.length,
                );
                res.json({
                    completed: false,
                    totalScore: game.totalScore,
                    roundScore: score,
                });
            }
        },
    );

    app.get(
        "/api/leaderboard",
        async (_req: Request, res: Response) => {
            try {
                const result = await pool.query(`
                SELECT accounts.username, MAX(games.score) as best_score
                FROM games
                JOIN accounts ON games.account_id = accounts.id
                GROUP BY accounts.username
                ORDER BY best_score DESC
                LIMIT 10
            `);
                res.json(result.rows);
            } catch (err) {
                console.error("Leaderboard error:", err);
                res.status(500).send("Database error");
            }
        },
    );
    app.post(
        "/api/game/quit",
        (req: Request, res: Response) => {
            if (!req.user)
                return res
                    .status(401)
                    .send("not logged in");
            activeGames.delete(req.user.id);
            res.json({ success: true });
        },
    );
}
