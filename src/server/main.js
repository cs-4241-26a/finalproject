import express from "express";
import ViteExpress from "vite-express";
import * as db from "./db-queries.js"
import "dotenv/config"
import bcrypt from "bcrypt"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"

const app = express();

app.use(express.json())
app.use(express.static("public"))

app.use(async (req, res, next) => {
    if(!db.initialized) { await db.init() }
    next()
})

//----------------Auth----------------

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
}))

app.use(passport.initialize())
app.use(passport.session())

// Local strategy: look up the username, auto-creating an account (with a
// hashed password) the first time it's seen
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        username = username.trim()

        if (username === "" || !password) {
            return done(null, false, { message: "Username and password required" })
        }

        let user = await db.getUserForAuth(username)
        let isNew = false

        if (user === null) {
            const passwordHash = await bcrypt.hash(password, 10)
            // Achievement "1" is "Create an account"
            await db.addUser({ username, passwordHash, bio: "", achievements: [] })
            user = await db.getUserForAuth(username)
            isNew = true
        }
        else {
            const match = await bcrypt.compare(password, user.passwordHash)
            if (!match) return done(null, false, { message: "Incorrect password" })
        }

        return done(null, user, { isNew })
    }
    catch (err) {
        return done(err)
    }
}))

passport.serializeUser((user, done) => done(null, user._id.toString()))

passport.deserializeUser(async (id, done) => {
    try {
        done(null, await db.getUserById(id))
    }
    catch (err) {
        done(err)
    }
})

app.post("/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(401).json({ error: info?.message || "Login failed" })

        req.logIn(user, (err) => {
            if (err) return next(err)
            res.json({ ok: true, isNew: !!info?.isNew, username: user.username })
        })
    })(req, res, next)
})

app.post("/auth/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)
        res.json({ ok: true })
    })
})

// Returns the logged in user (without the password hash), or 401 if signed out
app.get("/api/me", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Not logged in" })
    res.json(req.user)
})

const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.status(401).json({ error: "Not logged in" })
}

//----------------Profile (logged in user only)----------------

app.post("/api/profile/bio", requireAuth, async (req, res) => {
    const bio = String(req.body.bio ?? "").slice(0, 500)
    await db.modifyUser(req.user.username, { bio })
    res.json({ bio })
})

app.post("/api/profile/username", requireAuth, async (req, res) => {
    const username = String(req.body.username ?? "").trim()
    if (username === "") return res.status(400).json({ error: "Username required" })

    try {
        await db.renameUser(req.user.username, username)
    }
    catch (err) {
        // 11000 is Mongo's duplicate key error (the unique index on username)
        if (err.code === 11000) return res.status(409).json({ error: "That username is taken" })
        throw err
    }
    res.json({ username })
})

app.post("/api/profile/password", requireAuth, async (req, res) => {
    const password = String(req.body.password ?? "")
    if (password === "") return res.status(400).json({ error: "Password required" })

    await db.modifyUser(req.user.username, { passwordHash: await bcrypt.hash(password, 10) })
    res.json({ ok: true })
})

//----------------Search----------------

// Returns { games, users } whose names contain the query text (case-insensitive)
app.get("/api/search", async (req, res) => {
    const term = String(req.query.q ?? "").trim()
    if (term === "") return res.json({ games: [], users: [] })

    const [games, users] = await Promise.all([db.searchGames(term), db.searchUsers(term)])
    res.json({ games, users })
})

//----------------Games----------------

app.post("/addGame", async (req, res) => {
    await db.addGame(req.body)
    res.status(201).end()
})

app.get("/getGames", async (req, res) => {
    const games = await db.getAllGames()
    res.status(200).json(games)
})

//see the doc comment on getFilteredGames for details
app.post("/getFilteredGames", async (req, res) => {
    const games = await db.getFilteredGames(req.body)
    res.status(200).json(games)
})

// Only the description and tags can be edited, and only by a logged in user
app.post("/modifyGame", requireAuth, async (req, res) => {
    const description = String(req.body.description ?? "")
    const tags = Array.isArray(req.body.tags) ? req.body.tags.map(String) : []
    await db.modifyGame(req.body.name, { description, tags })
    res.status(200).end()
})

app.post("/deleteGame", async (req, res) => {
    await db.deleteGame(req.body.name)
    res.status(200).end()
})

//----------------Matches----------------

app.post("/addMatch", async (req, res) => {
    await db.addMatch(req.body)
    res.status(201).end()
})

app.get("/getMatches", async (req, res) => {
    const matches = await db.getAllMatches()
    res.status(200).json(matches)
})

//See the doc comment on getFilteredMatches for details
app.post("/getFilteredMatches", async (req, res) => {
    const matches = await db.getFilteredMatches(req.body)
    res.status(200).json(matches)
})

//See the doc comment on modifyMatch for details
app.post("/modifyMatch", async (req, res) => {
    await db.modifyMatch(req.body.oldId, req.body.newMatch)
    res.status(200).end()
})

app.post("/deleteMatch", async (req, res) => {
    await db.deleteMatch(req.body.id)
    res.status(200).end()
})

//----------------Users----------------

app.post("/addUser", async (req, res) => {
    await db.addUser(req.body)
    res.status(201).end()
})

app.get("/getUsers", async (req, res) => {
    const users = await db.getAllUsers()
    res.status(200).json(users)
})

app.post("/getUserByName", async (req, res) => {
    const user = await db.getUserByName(req.body.username)
    // User can evaluate to null if none is found and .send(null) causes an error when being parsed
    res.status(200).json(user)
})

//See the doc comment on modifyUser for details
// Users can only modify or delete their own account. Achievements need to be editable by everyone
app.post("/modifyUserAchievement", async (req, res) => {
    await db.modifyUser(req.body.username, {"achievements":req.body.update})
    res.status(200).end()
})

app.post("/modifyUser", requireAuth, async (req, res) => {
    await db.modifyUser(req.body.username, req.body.update)
    res.status(200).end()
})

app.post("/deleteUser", requireAuth, async (req, res) => {
    if (req.body.username !== req.user.username) return res.status(403).json({ error: "Not your account" })
    await db.deleteUser(req.body.username)
    req.logout(() => res.status(200).end())
})

//--------------------------------

const port = process.env.PORT || 3000
ViteExpress.listen(app, port, () =>
  console.log(`Server is listening on port ${port}...`),
);
