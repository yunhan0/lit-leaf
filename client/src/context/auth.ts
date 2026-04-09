import { create } from "zustand";

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
  } | null;
  loading: boolean;
  setUser: (user: AuthState["user"]) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    await fetch("/auth/logout", { method: "POST" });
    set({ user: null });
  },
}));
