import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/services/api";

export type Role = "superadmin" | "editor" | "advisor";
export interface Me { id: string; name: string; email: string; role: Role }
const Ctx = createContext<{ me: Me | null; ready: boolean; login: (e: string, p: string) => Promise<void>; logout: () => Promise<void> }>(null as any);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null); const [ready, setReady] = useState(false);
  useEffect(() => { api.get<{ user: Me }>("/admin/auth/me").then((r) => setMe(r.user)).catch(() => setMe(null)).finally(() => setReady(true)); }, []);
  const login = async (email: string, password: string) => { const r = await api.post<{ user: Me }>("/admin/auth/login", { email, password }); setMe(r.user); };
  const logout = async () => { await api.post("/admin/auth/logout"); setMe(null); };
  return <Ctx.Provider value={{ me, ready, login, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
