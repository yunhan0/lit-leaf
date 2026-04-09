export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string;
}

export interface ChildProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string | null;
  birthdate: string | null;
  ageGroup: "2-3" | "4-5" | "5-8";
  createdAt: string;
}

export interface GameProgress {
  id: string;
  profileId: string;
  gameCategory: "match" | "letters" | "coloring";
  gameId: string;
  level: number;
  score: number;
  stars: number;
  completedAt: string;
}
