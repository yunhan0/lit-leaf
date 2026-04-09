import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./auth/passport.js";
import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "lit-leaf-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🌿 Lit Leaf server running on http://localhost:${PORT}`);
});
