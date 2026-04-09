export interface GameItem {
  emoji: string;
  label: string;
}

export interface Round {
  items: GameItem[];
  differentIndex: number;
  prompt: string;
}

const CATEGORIES: GameItem[][] = [
  [
    { emoji: "🐶", label: "dog" },
    { emoji: "🐱", label: "cat" },
    { emoji: "🐰", label: "bunny" },
    { emoji: "🐻", label: "bear" },
    { emoji: "🦊", label: "fox" },
    { emoji: "🐸", label: "frog" },
    { emoji: "🐼", label: "panda" },
    { emoji: "🦁", label: "lion" },
  ],
  [
    { emoji: "🍎", label: "apple" },
    { emoji: "🍊", label: "orange" },
    { emoji: "🍋", label: "lemon" },
    { emoji: "🍇", label: "grapes" },
    { emoji: "🍓", label: "strawberry" },
    { emoji: "🍌", label: "banana" },
    { emoji: "🍉", label: "watermelon" },
    { emoji: "🍑", label: "peach" },
  ],
  [
    { emoji: "🚗", label: "car" },
    { emoji: "🚌", label: "bus" },
    { emoji: "🚂", label: "train" },
    { emoji: "✈️", label: "plane" },
    { emoji: "🚁", label: "helicopter" },
    { emoji: "🚢", label: "boat" },
  ],
  [
    { emoji: "🍕", label: "pizza" },
    { emoji: "🍔", label: "burger" },
    { emoji: "🌮", label: "taco" },
    { emoji: "🍦", label: "ice cream" },
    { emoji: "🍩", label: "donut" },
    { emoji: "🧁", label: "cupcake" },
    { emoji: "🍪", label: "cookie" },
  ],
  [
    { emoji: "🔴", label: "red" },
    { emoji: "🔵", label: "blue" },
    { emoji: "🟢", label: "green" },
    { emoji: "🟡", label: "yellow" },
    { emoji: "🟠", label: "orange" },
    { emoji: "🟣", label: "purple" },
  ],
  [
    { emoji: "⭐", label: "star" },
    { emoji: "❤️", label: "heart" },
    { emoji: "🌙", label: "moon" },
    { emoji: "☀️", label: "sun" },
    { emoji: "🌈", label: "rainbow" },
    { emoji: "☁️", label: "cloud" },
  ],
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickTwo<T>(arr: T[]): [T, T] {
  const shuffled = shuffle(arr);
  return [shuffled[0], shuffled[1]];
}

export function generateRound(): Round {
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const [same, different] = pickTwo(category);
  const differentIndex = Math.floor(Math.random() * 3);
  const items: GameItem[] = [same, same, same];
  items[differentIndex] = different;

  return {
    items,
    differentIndex,
    prompt: `Tap the one that is different!`,
  };
}

export function generateGame(totalRounds = 5): Round[] {
  return Array.from({ length: totalRounds }, () => generateRound());
}
