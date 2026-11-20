import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { COMPANY } from "@shared/content";
import { api } from "@/services/api";

type Site = typeof COMPANY & { address: string };
const Ctx = createContext<Site>(COMPANY as Site);

/** Merges verified defaults with values the client manages in the admin dashboard. */
export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<Site>(COMPANY as Site);
  useEffect(() => {
    api.get<{ site?: Partial<Site> }>("/settings/public")
      .then((s) => {
        if (!s.site) return;
        const clean = Object.fromEntries(Object.entries(s.site).filter(([, v]) => v !== "" && v != null));
        setSite((p) => ({ ...p, ...clean, social: { ...p.social, ...((s.site as any).social || {}) } }));
      })
      .catch(() => {});
  }, []);
  return <Ctx.Provider value={site}>{children}</Ctx.Provider>;
}
export const useSite = () => useContext(Ctx);
