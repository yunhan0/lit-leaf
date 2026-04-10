export interface ColorOption {
  id: string;
  hex: string;
  label: string;
}

export interface ColoringRegion {
  id: string;
  label: string;
}

export interface ColoringPage {
  id: string;
  name: string;
  emoji: string;
  regions: ColoringRegion[];
}

export const COLORS: ColorOption[] = [
  { id: "red", hex: "#ef4444", label: "Red" },
  { id: "blue", hex: "#3b82f6", label: "Blue" },
  { id: "green", hex: "#22c55e", label: "Green" },
  { id: "yellow", hex: "#eab308", label: "Yellow" },
  { id: "orange", hex: "#f97316", label: "Orange" },
  { id: "purple", hex: "#a855f7", label: "Purple" },
  { id: "pink", hex: "#ec4899", label: "Pink" },
  { id: "brown", hex: "#92400e", label: "Brown" },
];

export const PAGES: ColoringPage[] = [
  {
    id: "bear",
    name: "Bear",
    emoji: "🐻",
    regions: [
      { id: "face", label: "Face" },
      { id: "left-ear", label: "Left Ear" },
      { id: "right-ear", label: "Right Ear" },
      { id: "left-eye", label: "Left Eye" },
      { id: "right-eye", label: "Right Eye" },
      { id: "nose", label: "Nose" },
      { id: "mouth", label: "Mouth" },
    ],
  },
  {
    id: "bunny",
    name: "Bunny",
    emoji: "🐰",
    regions: [
      { id: "face", label: "Face" },
      { id: "left-ear", label: "Left Ear" },
      { id: "right-ear", label: "Right Ear" },
      { id: "left-eye", label: "Left Eye" },
      { id: "right-eye", label: "Right Eye" },
      { id: "nose", label: "Nose" },
      { id: "mouth", label: "Mouth" },
    ],
  },
  {
    id: "cat",
    name: "Cat",
    emoji: "🐱",
    regions: [
      { id: "face", label: "Face" },
      { id: "left-ear", label: "Left Ear" },
      { id: "right-ear", label: "Right Ear" },
      { id: "left-eye", label: "Left Eye" },
      { id: "right-eye", label: "Right Eye" },
      { id: "nose", label: "Nose" },
      { id: "mouth", label: "Mouth" },
    ],
  },
];
