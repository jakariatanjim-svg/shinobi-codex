/* Shinobi Codex v3.8 — live official databook stats hook (Rin/Sha/Tō no Sho) */

import { useEffect, useState } from "react";
import { fetchOfficialStats, peekOfficialStats, type OfficialStats } from "../lib/officialStats";

export function useOfficialStats(name: string | undefined): { stats: OfficialStats | null; loading: boolean } {
  const [stats, setStats] = useState<OfficialStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!name) return;
    let alive = true;

    const cached = peekOfficialStats(name);
    if (cached !== undefined) {
      setStats(cached);
      setLoading(false);
      return;
    }

    setStats(null);
    setLoading(true);
    fetchOfficialStats(name)
      .then((result) => {
        if (!alive) return;
        setStats(result);
        setLoading(false);
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [name]);

  return { stats, loading };
}
