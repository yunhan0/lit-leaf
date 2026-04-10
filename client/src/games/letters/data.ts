export interface GameItem {
  emoji: string;
  label: string;
}

export interface LetterRound {
  letter: string;
  items: GameItem[];
  correctIndex: number;
}

const LETTER_MAP: Record<string, GameItem[]> = {
  A: [{ emoji: "🍎", label: "apple" }],
  B: [
    { emoji: "🐻", label: "bear" },
    { emoji: "🏀", label: "ball" },
    { emoji: "🐝", label: "bee" },
  ],
  C: [
    { emoji: "🐱", label: "cat" },
    { emoji: "🍪", label: "cookie" },
  ],
  D: [
    { emoji: "🐕", label: "dog" },
    { emoji: "🦕", label: "dinosaur" },
  ],
  E: [{ emoji: "🥚", label: "egg" }],
  F: [
    { emoji: "🐸", label: "frog" },
    { emoji: "🐟", label: "fish" },
  ],
  G: [{ emoji: "🍇", label: "grapes" }],
  H: [{ emoji: "🏠", label: "house" }],
  M: [{ emoji: "🌙", label: "moon" }],
  S: [
    { emoji: "⭐", label: "star" },
    { emoji: "☀️", label: "sun" },
  ],
  T: [{ emoji: "🐢", label: "turtle" }],
};

const LETTERS = Object.keys(LETTER_MAP);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getItemsForLetter(letter: string): GameItem[] {
  const result: GameItem[] = [];
  for (const [l, items] of Object.entries(LETTER_MAP)) {
    if (l !== letter) {
      result.push(...items);
    }
  }
  return result;
}

export function generateRound(): LetterRound {
  const letter = pickRandom(LETTERS);
  const correctItem = pickRandom(LETTER_MAP[letter]);

  const distractorPool = shuffle(getItemsForLetter(letter));
  const distractors = distractorPool.slice(0, 3);

  const items = shuffle([correctItem, ...distractors]);
  const correctIndex = items.findIndex(
    (item) => item.emoji === correctItem.emoji && item.label === correctItem.label
  );

  return { letter, items, correctIndex };
}

export function generateGame(totalRounds = 5): LetterRound[] {
  const usedLetters: string[] = [];
  const rounds: LetterRound[] = [];

  for (let i = 0; i < totalRounds; i++) {
    let letter: string;
    let attempts = 0;
    do {
      letter = pickRandom(LETTERS);
      attempts++;
    } while (usedLetters.includes(letter) && attempts < 20);

    usedLetters.push(letter);

    const correctItem = pickRandom(LETTER_MAP[letter]);
    const distractorPool = shuffle(getItemsForLetter(letter));
    const distractors = distractorPool.slice(0, 3);
    const items = shuffle([correctItem, ...distractors]);
    const correctIndex = items.findIndex(
      (item) => item.emoji === correctItem.emoji && item.label === correctItem.label
    );

    rounds.push({ letter, items, correctIndex });
  }

  return rounds;
}
