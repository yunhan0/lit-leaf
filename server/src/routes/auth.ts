import { Router } from "express";
import passport from "../auth/passport.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || "http://localhost:5173");
  }
);

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ ok: true });
  });
});

export default router;
