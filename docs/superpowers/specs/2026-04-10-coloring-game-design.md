# Phase 5: Coloring Game

## Overview

A tap-to-fill coloring game where children pick colors and tap SVG regions to fill them. Creative, no wrong answers — just fun coloring.

## Interaction Model

**Tap-to-fill**: Select a color from the palette, tap a region in the SVG, it fills with that color. Simple and precise for age 2-3.

## Coloring Pages

**Simple animal faces** — 5-7 large, distinct regions per page.

3 pages for initial release:

### Bear
Regions: face, left ear, right ear, left eye, right eye, nose, mouth/cheeks

### Bunny
Regions: face, left ear, right ear, left eye, right eye, nose, mouth

### Cat
Regions: face, left ear, right ear, left eye, right eye, nose, mouth

Each page is an inline SVG with distinct `<path>` or `<circle>` elements as clickable regions. Regions start with `fill="white"` and `stroke="#333"` outlines.

## Color Palette

8 bright, kid-friendly colors:
- Red (#ef4444), Blue (#3b82f6), Green (#22c55e), Yellow (#eab308)
- Orange (#f97316), Purple (#a855f7), Pink (#ec4899), Brown (#92400e)

Displayed as large circles (48px+) at the bottom of the screen. Selected color shows a ring/glow.

## Game Flow

1. **Page selector** — 3 animal thumbnails, kid taps one
2. **Coloring screen** — SVG in center, palette at bottom, undo/reset buttons
3. **Region interaction** — tap color to select, tap region to fill; regions highlight on hover
4. **Completion** — when all regions filled, celebration animation + 1 star
5. **After completion** — "Pick another!" or "Done" buttons

## Scoring

- 1 star per completed page (all regions filled)
- Saves progress as `gameCategory: "coloring"`, `gameId: "coloring-<animal>"`
- Simpler scoring than Match/Letter — coloring is creative, not right/wrong

## UX Details

- Selected color: visible ring/glow border
- Regions: subtle highlight on hover (opacity change) to indicate tappability
- Big touch targets (48px+ for palette, entire SVG regions)
- Undo: resets last fill
- Reset all: clears entire page to white
- No "wrong" answers — pure creative expression
- Purple/indigo theme (consistent with app, distinct from green Match and blue Letters)

## Files to Create/Modify

1. **Create** `client/src/games/coloring/data.ts` — SVG definitions, color palette, page metadata
2. **Create** `client/src/games/coloring/ColoringGame.tsx` — page selector, coloring canvas, completion flow
3. **Modify** `client/src/App.tsx` — add `/games/coloring` route
4. **Modify** `client/src/pages/HomePage.tsx` — enable Coloring button, link to game
