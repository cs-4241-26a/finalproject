// (Passport + bcrypt + MongoDB) can replace this file without touching them.
// Keep the same URLs and the same JSON shapes when swapping it out.
//
//   POST /login { username, password } -> { username } | 401 { error }
//   POST /logout -> { ok: true }
//   GET  /api/me -> { username } | 401 { error }
//   GET  /api/games -> [ { id, title, path } ]
//   GET  /api/scores?game=<id> -> [ { username, score, date } ] (top 10)
//   POST /api/scores  { game, score } -> { rank, scores } (rank is null if outside top 10)
//
// Scores dont reset whenever the server restarts, MongoDB keeps it stores.

import express from "express";
import { MongoClient } from "mongodb"; 


export const GAMES = [
  { 
    id: "galaxy-attackers", 
    title: "Galaxy Attackers", 
    path: "/games/galaxy-attackers/",
    thumbnail: "/games/galaxy-attackers/sprites/galaxy_player.png",
    blurb: "Blast waves of swooping bees before they dive at you.",
  },
];

export let usersCollection = null
let scoresCollection = null

//Connect to MongoDB
export async function connectDb() {
  const client = new MongoClient(process.env.MONGODB_URI)
  usersCollection = await client.db("arcade").collection("users")
  scoresCollection = await client.db("arcade").collection("scores")
}


export const api = express.Router()


api.get("/api/me", (req, res) => {
  res.json({
    username: req.session.username, 
    guest: Boolean(req.session.guest)})
});

api.get("/api/games", (req, res) => {
  res.json(GAMES);
});

const topScores = (game) =>
  scoresCollection.find({ game }).sort({score:-1, date: 1 }).limit(10).toArray()

const clean = (docs) => docs.map(({ username, score, date}) => ({ username, score, date}))


api.get("/api/scores", async (req, res) => {
  const game = (req.query.game ?? "")
  if (!GAMES.some((g) => g.id === game)) {
    return res.status(400).json({ error: "Unkown game" });
  }
  res.json(clean(await topScores(game)));
});



api.post("/api/scores", async (req, res) => {
  const { game, score } = req.body

  if (!GAMES.some((g) => g.id === game) || !Number.isInteger(score) || score < 0) {
    return res.status(400).json({ error: "Bad score." });
  }
  
  const result = await scoresCollection.insertOne({
    game,
    username: req.session.username,
    score,
    date: new Date().toISOString()
  })

  const top = await topScores(game);
  const index = top.findIndex((s) => s._id.equals(result.insertedId));
  res.json({ rank: index === -1 ? null : index + 1, scores: clean(top) });
});