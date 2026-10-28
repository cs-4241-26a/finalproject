import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/express"; // Imported getAuth instead

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/users/sync
 * Syncs the Clerk user with the Prisma database.
 */
router.post("/sync", async (req, res) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { email } = req.body;
    const clerkId = auth.userId;

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { email },
      create: { clerkId, email },
    });

    res.json({ message: "User synced successfully", user });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

/**
 * GET /api/users/me
 * Retrieves the current user's profile from your DB.
 */
router.get("/me", async (req, res) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/users/saved-searches
 * Saves a ZIP code to the user's profile.
 */
router.post("/saved-searches", async (req, res) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) return res.status(401).json({ error: "Unauthorized" });

    const { zip } = req.body;
    if (!zip) return res.status(400).json({ error: "ZIP code is required" });

    // Find the internal user ID using the Clerk ID
    const user = await prisma.user.upsert({
      where: { clerkId: auth.userId },
      update: {},
      create: { clerkId: auth.userId },
    });

    const savedSearch = await prisma.savedSearch.upsert({
      where: {
        userId_zip: {
          userId: user.id,
          zip,
        },
      },
      update: {},
      create: {
        userId: user.id,
        zip,
      },
      include: { place: true },
    });

    res.json(savedSearch);
  } catch (error: any) {
    // Handle Prisma unique constraint violation (P2002) if they already saved it
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Location already saved" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/users/saved-searches
 * Retrieves all saved searches for the logged-in user.
 */
router.get("/saved-searches", async (req, res) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.upsert({
      where: { clerkId: auth.userId },
      update: {},
      create: { clerkId: auth.userId },
    });

    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId: user.id },
      include: { place: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(savedSearches);
  } catch (error) {
    console.error("GET /saved-searches failed:", error);
    res.status(500).json({ error: "Unable to load bookmarks" });
  }
});

/**
 * DELETE /api/users/saved-searches/:id
 * Removes a saved search.
 */
router.delete("/saved-searches/:id", async (req, res) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) return res.status(401).json({ error: "Unauthorized" });

    const rawId = req.params.id;
    const searchId = Number(rawId);

    if (
      typeof rawId !== "string" ||
      !/^\d+$/.test(rawId) ||
      !Number.isSafeInteger(searchId) ||
      searchId < 1
    ) {
      return res.status(400).json({ error: "Invalid bookmark ID" });
    }

    const deleted = await prisma.savedSearch.deleteMany({
      where: {
        id: searchId,
        user: { clerkId: auth.userId },
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Saved search not found" });
    }

    res.json({ message: "Saved search removed" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
