import express from "express";
import { ObjectId } from "mongodb";

// Portfolio post routes, kept in their own file so main.js barely changes.
//
// Ownership rule: the server never trusts the client about who owns what.
//   - Reading a portfolio is public.
//   - Every write uses req.user._id from the session, and every post query is
//     scoped with { owner: req.user._id }, so you can only touch your own posts
//     even with a hand-crafted request.
//   - isOwner is sent to the client only to decide whether to show edit tools.
export default function registerPortfolioRoutes(app, client, ensureAuthenticated) {
    const posts = client.db("portfolio_maker").collection("posts");
    const users = client.db("portfolio_maker").collection("users");
    const json = express.json();

    // Public: a user's profile + posts + whether the viewer owns this portfolio
    app.get('/api/portfolio/:uid', async (req, res) => {
        const { uid } = req.params;
        if (!ObjectId.isValid(uid)) {
            return res.status(404).json({ error: "Portfolio not found" });
        }

        // never send the password (or anything else private) to the browser
        const owner = await users.findOne(
            { _id: new ObjectId(uid) },
            { projection: { username: 1, bio: 1, avatarUrl: 1 } }
        );
        if (!owner) {
            return res.status(404).json({ error: "Portfolio not found" });
        }

        const ownerPosts = await posts
            .find({ owner: new ObjectId(uid) })
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            profile: {
                username: owner.username,
                bio: owner.bio ?? "",
                avatarUrl: owner.avatarUrl ?? "",
            },
            posts: ownerPosts,
            isOwner: isOwner(req, uid),
        });
    });

    // Owner only: edit your own profile (bio + profile picture).
    // No uid in the URL on purpose -- it always updates the logged in user.
    app.put('/api/profile', ensureAuthenticated, json, async (req, res) => {
        const update = {
            bio: cleanString(req.body.bio, 1000),
            avatarUrl: cleanString(req.body.avatarUrl, 2000),
        };
        if (update.avatarUrl && !/^https?:\/\//i.test(update.avatarUrl)) {
            return res.status(400).json({ error: "Profile picture must be an http(s) link" });
        }

        await users.updateOne({ _id: req.user._id }, { $set: update });
        res.json(update);
    });

    // Owner only: create a post on your own portfolio
    app.post('/api/posts', ensureAuthenticated, json, async (req, res) => {
        const fields = readPostFields(req.body);
        if (!fields.title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const post = { ...fields, owner: req.user._id, createdAt: new Date() };
        const result = await posts.insertOne(post);
        res.status(201).json({ ...post, _id: result.insertedId });
    });

    // Owner only: edit one of your posts
    app.put('/api/posts/:id', ensureAuthenticated, json, async (req, res) => {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: "Post not found" });
        }
        const fields = readPostFields(req.body);
        if (!fields.title) {
            return res.status(400).json({ error: "Title is required" });
        }

        // owner in the filter = can't edit someone else's post
        const updated = await posts.findOneAndUpdate(
            { _id: new ObjectId(req.params.id), owner: req.user._id },
            { $set: { ...fields, updatedAt: new Date() } },
            { returnDocument: "after" }
        );
        if (!updated) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(updated);
    });

    // Owner only: delete one of your posts
    app.delete('/api/posts/:id', ensureAuthenticated, async (req, res) => {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: "Post not found" });
        }
        const result = await posts.deleteOne({
            _id: new ObjectId(req.params.id),
            owner: req.user._id,
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(204).end();
    });
}

// true if the logged in user owns portfolio `uid`
function isOwner(req, uid) {
    return req.isAuthenticated() && !!req.user?._id && req.user._id.toString() === uid;
}

function cleanString(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

// Only copy allowed fields -- never spread req.body into the DB,
// or a client could overwrite `owner`.
function readPostFields(body = {}) {
    return {
        title: cleanString(body.title, 200),
        description: cleanString(body.description, 5000),
        imageUrl: cleanString(body.imageUrl, 2000), 
        priority: cleanString(body.priority, 200)
    };
}
