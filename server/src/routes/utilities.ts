import { Router } from "express";
import { PrismaClient, type Prisma } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/suggestions", async (req, res) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

    if (q.length < 2) {
      return res.json([]);
    }

    if (q.length > 100) {
      return res.status(400).json({ error: "Search is too long." });
    }

    const parts = q.split(",").map((part) => part.trim());

    const where: Prisma.PlaceWhereInput = /^\d+$/.test(q)
      ? { zip: { startsWith: q } }
      : {
          city: {
            startsWith: parts[0],
            mode: "insensitive",
          },
          ...(parts[1]
            ? {
                state: {
                  startsWith: parts[1],
                  mode: "insensitive",
                },
              }
            : {}),
        };

    const locations = await prisma.place.findMany({
      where,
      select: {
        city: true,
        state: true,
      },
      distinct: ["city", "state"],
      orderBy: [{ city: "asc" }, { state: "asc" }],
      take: 8,
    });

    return res.json(locations);
  } catch (error) {
    console.error("Error loading suggestions:", error);
    return res.status(500).json({ error: "Unable to load suggestions." });
  }
});

router.get("/:userInput", async (req, res) => {
  try {
    const parameter = req.params.userInput;

    if (typeof parameter !== "string") {
      return res.status(400).json({ error: "Invalid search." });
    }

    const input = parameter.trim();

    if (!input || input.length > 100) {
      return res.status(400).json({
        error: "Enter a city name or five-digit ZIP code.",
      });
    }

    const isZip = /^\d{5}$/.test(input);

    if (/^\d+$/.test(input) && !isZip) {
      return res.status(400).json({
        error: "ZIP codes must contain exactly five digits.",
      });
    }

    let where: Prisma.PlaceWhereInput;

    if (isZip) {
      where = { zip: input };
    } else {
      const parts = input.split(",").map((part) => part.trim());

      if (
        parts.length > 2 ||
        parts[0].length < 2 ||
        (parts.length === 2 && !/^[a-z]{2}$/i.test(parts[1]))
      ) {
        return res.status(400).json({
          error:
            "Enter a city name, optionally followed by a state abbreviation.",
        });
      }

      where = {
        city: {
          contains: parts[0],
          mode: "insensitive",
        },
        ...(parts.length === 2 ? { state: parts[1].toUpperCase() } : {}),
      };
    }

    const places = await prisma.place.findMany({
      where,
      orderBy: [{ zip: "asc" }],
      select: {
        zip: true,
        city: true,
        state: true,
      },
    });

    if (places.length === 0) {
      return res.status(404).json({
        message: "No matching locations found.",
      });
    }

    const offerings = await prisma.offering.findMany({
      where: {
        zip: { in: places.map((place) => place.zip) },
      },
      include: {
        provider: true,
        place: true,
      },
      orderBy: [{ zip: "asc" }, { category: "asc" }, { providerId: "asc" }],
    });

    const utilities: Record<string, typeof offerings> = {};

    for (const offering of offerings) {
      (utilities[offering.category] ??= []).push(offering);
    }
    router.get("/suggestions", async (req, res) => {
      try {
        const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

        if (q.length < 2) {
          return res.json([]);
        }

        if (q.length > 100) {
          return res.status(400).json({ error: "Search is too long." });
        }

        const parts = q.split(",").map((part) => part.trim());

        const where: Prisma.PlaceWhereInput = /^\d+$/.test(q)
          ? { zip: { startsWith: q } }
          : {
              city: {
                startsWith: parts[0],
                mode: "insensitive",
              },
              ...(parts[1]
                ? {
                    state: {
                      startsWith: parts[1],
                      mode: "insensitive",
                    },
                  }
                : {}),
            };

        const places = await prisma.place.findMany({
          where,
          select: { zip: true, city: true, state: true },
          orderBy: [{ city: "asc" }, { state: "asc" }, { zip: "asc" }],
          take: 8,
        });

        return res.json(places);
      } catch (error) {
        console.error("Error loading suggestions:", error);
        return res.status(500).json({ error: "Unable to load suggestions." });
      }
    });
    return res.json({
      places,
      utilities,
    });
  } catch (error) {
    console.error("Error fetching utilities:", error);
    return res.status(500).json({
      error: "Unable to load utilities. Please try again.",
    });
  }
});

export default router;
