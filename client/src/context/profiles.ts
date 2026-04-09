import { create } from "zustand";

interface ChildProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string | null;
  birthdate: string | null;
  ageGroup: string;
  createdAt: string;
}

interface ProfileState {
  profiles: ChildProfile[];
  activeProfile: ChildProfile | null;
  setProfiles: (profiles: ChildProfile[]) => void;
  addProfile: (profile: ChildProfile) => void;
  updateProfile: (profile: ChildProfile) => void;
  removeProfile: (id: string) => void;
  setActiveProfile: (profile: ChildProfile | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profiles: [],
  activeProfile: null,
  setProfiles: (profiles) => set({ profiles }),
  addProfile: (profile) =>
    set((state) => ({ profiles: [...state.profiles, profile] })),
  updateProfile: (profile) =>
    set((state) => ({
      profiles: state.profiles.map((p) => (p.id === profile.id ? profile : p)),
      activeProfile:
        state.activeProfile?.id === profile.id ? profile : state.activeProfile,
    })),
  removeProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
      activeProfile:
        state.activeProfile?.id === id ? null : state.activeProfile,
    })),
  setActiveProfile: (profile) => set({ activeProfile: profile }),
}));
