import { Router } from "express";
import { prisma } from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.use(authRequired);

router.get("/profiles", async (req, res) => {
  const userId = (req as any).session.passport.user;
  const profiles = await prisma.childProfile.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  res.json({ profiles });
});

router.post("/profiles", async (req, res) => {
  const userId = (req as any).session.passport.user;
  const { name, avatar, birthdate, ageGroup } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  const profile = await prisma.childProfile.create({
    data: {
      userId,
      name: name.trim(),
      avatar: avatar || null,
      birthdate: birthdate || null,
      ageGroup: ageGroup || "2-3",
    },
  });

  res.status(201).json({ profile });
});

router.patch("/profiles/:id", async (req, res) => {
  const userId = (req as any).session.passport.user;
  const { id } = req.params;
  const { name, avatar, birthdate, ageGroup } = req.body;

  const existing = await prisma.childProfile.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const profile = await prisma.childProfile.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(avatar !== undefined && { avatar }),
      ...(birthdate !== undefined && { birthdate }),
      ...(ageGroup !== undefined && { ageGroup }),
    },
  });

  res.json({ profile });
});

router.delete("/profiles/:id", async (req, res) => {
  const userId = (req as any).session.passport.user;
  const { id } = req.params;

  const existing = await prisma.childProfile.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Profile not found" });
  }

  await prisma.childProfile.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
