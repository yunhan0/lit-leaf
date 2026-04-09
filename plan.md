# Lit Leaf - App Plan

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **Frontend** | React + TypeScript + Vite | Fast, widely known, great for SPA games |
| **UI/Styling** | Tailwind CSS | Rapid prototyping, consistent kid-friendly design |
| **Backend** | Node.js + Express + TypeScript | Simple API, auth proxy, progress tracking |
| **Database** | PostgreSQL + Prisma ORM | Relational data (users, profiles, progress), type-safe |
| **Auth** | Google OAuth 2.0 (via `passport.js`) | Third-party only, no passwords |
| **Hosting** | Vercel (frontend) + Railway/Render (backend) | Easy deploy, free tiers available |

## Data Model

```
User (Google account)
 ├── id, email, name, avatar, createdAt
 │
 ├── ChildProfile (1-many)
 │    ├── id, userId, name, avatar, birthdate, ageGroup
 │    │
 │    └── GameProgress (1-many)
 │         ├── id, profileId, gameCategory, gameId
 │         ├── level, score, completedAt
 │         └── stars (reward tracking)
```

## Project Structure

```
lit-leaf/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Login screen, Google OAuth button
│   │   │   ├── profile/       # Profile selector, create/edit profile
│   │   │   ├── dashboard/     # Home screen after profile select
│   │   │   ├── games/
│   │   │   │   ├── common/    # Shared game UI (star rewards, timer, nav)
│   │   │   │   ├── match/     # Game 1: Find similar/different
│   │   │   │   ├── letters/   # Game 2: Recognise letters
│   │   │   │   └── coloring/  # Game 3: Coloring pictures
│   │   │   └── shared/        # Navbar, buttons, layouts
│   │   ├── hooks/             # useAuth, useProgress, useGame
│   │   ├── context/           # AuthContext, ProfileContext
│   │   ├── assets/            # Images, SVGs, sounds
│   │   │   ├── images/        # Game objects, coloring pages
│   │   │   └── sounds/        # Correct/wrong answer sounds
│   │   ├── types/
│   │   ├── api/
│   │   └── utils/
│   └── public/
├── server/                    # Express backend
│   ├── src/
│   │   ├── auth/              # Google OAuth routes, session mgmt
│   │   ├── routes/            # Profiles, progress, games
│   │   ├── middleware/        # Auth guard, error handling
│   │   └── prisma/            # Schema, migrations, seed
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts            # Sample game data
├── shared/                    # Shared types between client/server
│   └── types.ts
├── package.json               # Monorepo with workspaces
└── docker-compose.yml         # Postgres for local dev
```

## Game Details (Age 2-3)

### Game 1: Find Similar / Different Objects
- **Concept**: Show 3-4 objects, ask "Which one is different?" or "Find two that are the same!"
- **Difficulty levels**: Start with obvious differences (colors), progress to subtle (shape/size)
- **UX**: Big tap targets, celebration animation on correct answer
- **Assets needed**: ~30-40 object SVGs (animals, fruits, shapes, toys)

### Game 2: Recognise Letters
- **Concept**: Show a letter + 3-4 images, tap the one that starts with that letter
- **Difficulty levels**: Start with uppercase A-B-C, add more letters and lowercase
- **UX**: Letter spoken aloud (Web Speech API or pre-recorded), phonics sounds
- **Assets needed**: Letter graphics, ~50 word images mapped to letters

### Game 3: Coloring Simple Pictures
- **Concept**: Large simple outlines (animals, objects) + color palette
- **Difficulty levels**: Fewer regions → more regions, more colors
- **UX**: Tap a color, tap a region to fill it. Large palette, undo button
- **Assets needed**: 10-15 SVG coloring pages with defined fill regions

## UX Principles (Age 2-3)
- **No text instructions** — voice prompts + visual arrows/animations
- **Large touch targets** (min 48px, ideally 64px+)
- **Positive reinforcement only** — no "wrong", just "try again!" with encouragement
- **Auto-advance** — no complex navigation, game flows automatically
- **Rewards** — stars, stickers, celebration animations after each round
- **Short sessions** — 3-5 rounds per game, ~2 min total

## Phased Build Plan

| Phase | Scope |
|---|---|
| **Phase 1** | Project setup, Google OAuth login, DB schema |
| **Phase 2** | Profile creation/selection screen |
| **Phase 3** | Game 1 — Find similar/different (standalone, no backend) |
| **Phase 4** | Game 2 — Recognise letters |
| **Phase 5** | Game 3 — Coloring |
| **Phase 6** | Progress tracking (save scores to backend) |
| **Phase 7** | Dashboard, reward system, polish |

## Key Packages

```
client:  react, react-router, zustand (state), framer-motion (animations),
         howler.js (sounds), @tanstack/react-query

server:  express, prisma, passport, passport-google-oauth20,
         express-session, zod, cors
```
