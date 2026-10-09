import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";
import utilityRoutes from "./routes/utilities";
import userRoutes from "./routes/users";

const app = express();

// Render runs behind a proxy; needed so rate limiting sees real client IPs
app.set("trust proxy", 1);

// security header
// CSP disabled so Clerk's scripts/images (served from Clerk domains) can load
app.use(helmet({ contentSecurityPolicy: false }));

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// body parsing
app.use(express.json());

// rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", apiLimiter);

// Middleware
app.use(
  clerkMiddleware({
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  }),
);

// routes
app.use("/api/utilities", utilityRoutes);
app.use("/api/users", userRoutes);

// Serve the built React client (single-service deploy)
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
// SPA fallback: any non-API GET returns index.html so React Router handles it
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(clientDist, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
