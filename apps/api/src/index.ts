import { Pool } from "pg";
import { createApp } from "./app.ts";
import { config } from "dotenv";
import { setupGameEndpoints } from "./game-endpoints.ts";
import path from "node:path";
import express from "express";
config();

//const game = require("./game-enpoints")
const port = Number(process.env.PORT ?? 3000);
const databaseUrl = process.env.DATABASE_URL;
const sessionSecret = process.env.SESSION_SECRET;
const pool = new Pool({ connectionString: databaseUrl });
pool.on("error", (error) =>
    console.error("PostgreSQL pool error:", error),
);
if (!databaseUrl || !sessionSecret) {
    throw new Error(
        "DATABASE_URL and SESSION_SECRET are required",
    );
}

const app = createApp(pool, sessionSecret);

app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
});

setupGameEndpoints(app, pool);

const frontendPath = path.join(
    import.meta.dirname,
    "../../web/dist",
);
app.use(express.static(frontendPath));
app.use((_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, () => {
    console.log(
        `API listening on http://localhost:${port}`,
    );
});
