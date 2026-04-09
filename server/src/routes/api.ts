import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/me", async (req, res) => {
  const userId = (req as any).session?.passport?.user;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  res.json({ user });
});

export default router;
