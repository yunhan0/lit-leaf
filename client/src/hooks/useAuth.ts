import { useEffect } from "react";
import { useAuthStore } from "../context/auth";

export function useAuth() {
  const { user, loading, setUser, logout } = useAuthStore();

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, [setUser]);

  return { user, loading, logout };
}
