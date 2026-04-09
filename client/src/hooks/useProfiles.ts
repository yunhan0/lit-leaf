import { useEffect } from "react";
import { useProfileStore } from "../context/profiles";

export function useProfiles() {
  const { profiles, setProfiles } = useProfileStore();

  useEffect(() => {
    fetch("/api/profiles", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { profiles: [] }))
      .then((data) => setProfiles(data.profiles ?? []))
      .catch(() => setProfiles([]));
  }, [setProfiles]);

  return { profiles };
}
