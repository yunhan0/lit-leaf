import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../db.js";

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email found"), false);

          const user = await prisma.user.upsert({
            where: { email },
            update: {
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            },
            create: {
              email,
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            },
          });

          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
} else {
  console.warn(
    "⚠️  GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not set. OAuth disabled."
  );
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

declare module "express-session" {
  interface SessionData {
    passport?: { user?: string };
  }
}

export default passport;
