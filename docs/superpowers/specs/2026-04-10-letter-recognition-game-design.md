# Phase 4: Letter Recognition Game

## Overview

A multiple-choice game where children see a letter and tap the emoji image whose word starts with that letter. Follows the same architecture as the Match Game (Phase 3).

## Gameplay

- **5 rounds** per game session
- Each round: a **big letter** displayed at top + **4 emoji options** below
- Child taps the emoji whose word starts with the shown letter
- Correct: shows celebration + learning text ("Apple starts with A!")
- Wrong: gentle "Try again!" with shake animation
- After 5 rounds: game complete screen with star summary

## Data Model

### Letter-to-Emoji Map (data.ts)

Curated for age 2-3 using common, unambiguous words:

```
A: 🍎 apple
B: 🐻 bear / 🏀 ball / 🐝 bee
C: 🐱 cat / 🍪 cookie
D: 🐕 dog / 🦕 dinosaur
E: 🥚 egg
F: 🐸 frog / 🐟 fish
G: 🍇 grapes
H: 🏠 house
M: 🌙 moon
S: ⭐ star / ☀️ sun
T: 🐢 turtle
```

Each round:
1. Pick a random target letter
2. Select the correct emoji for that letter
3. Pick 3 distractor emojis from other letters
4. Shuffle all 4, record correct index

### Round interface

```ts
interface LetterRound {
  letter: string;
  items: GameItem[];
  correctIndex: number;
}
```

## UI Layout

```
┌──────────────────────────────┐
│ ✕ Quit     ● ● ○ ○ ○   ⭐ 3│  <- header: quit, progress dots, stars
│                              │
│            A                 │  <- big letter (text-8xl)
│   "Tap the picture that      │
│    starts with this letter!" │
│                              │
│   🍎   🐱   🐶   🐰        │  <- 4 emoji buttons in a row
│                              │
│         ✨ Yay! ✨           │  <- feedback text
└──────────────────────────────┘
```

## Scoring

Same as MatchGame:
- First attempt correct: 3 stars
- Second attempt: 2 stars
- Third+ attempt: 1 star
- Max per game: 15 stars (5 rounds x 3)

## Progress Saving

- `POST /api/progress` with `gameCategory: "letters"`, `gameId: "letter-recognition"`
- Updates `totalStars` on the active child profile

## Files to Create/Modify

1. **Create** `client/src/games/letters/data.ts` — letter map, round generation
2. **Create** `client/src/games/letters/LetterGame.tsx` — game UI component
3. **Modify** `client/src/App.tsx` — add `/games/letters` route
4. **Modify** `client/src/pages/HomePage.tsx` — enable Letters button, link to game

## Design Decisions

- **No audio in this phase** — visual-only. Web Speech API can be added later.
- **4 options** instead of 3 (standard multiple-choice, age-appropriate challenge)
- **Letter subset** for age 2-3: A-H plus M, S, T — letters with clear, common emoji mappings
- **Same component pattern** as MatchGame for consistency and maintainability
