import { useEffect, useState, useCallback } from "react";
import { api } from "@/services/api";

export function useFetch<T>(path: string | null, fallback?: T) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!path) return;
    let live = true;
    setLoading(true);
    api.get<T>(path)
      .then((d) => { if (live) { setData(d); setError(null); } })
      .catch((e) => { if (live) { setError(e.message); if (fallback !== undefined) setData(fallback); } })
      .finally(() => live && setLoading(false));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, tick]);
  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, reload };
}
