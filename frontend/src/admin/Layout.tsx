import { useState } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, Users, FileText, Image, Inbox, CalendarCheck, Mail, Settings, ShieldCheck, History, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth, Role } from "./auth";
import { Helmet } from "react-helmet-async";

const NAV: { to: string; label: string; icon: any; roles: Role[] }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["superadmin", "editor", "advisor"] },
  { to: "/admin/services", label: "Services", icon: Briefcase, roles: ["superadmin", "editor"] },
  { to: "/admin/team", label: "Team", icon: Users, roles: ["superadmin", "editor"] },
  { to: "/admin/articles", label: "Insights", icon: FileText, roles: ["superadmin", "editor"] },
  { to: "/admin/media", label: "Media", icon: Image, roles: ["superadmin", "editor"] },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox, roles: ["superadmin", "editor", "advisor"] },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck, roles: ["superadmin", "editor", "advisor"] },
  { to: "/admin/subscribers", label: "Newsletter", icon: Mail, roles: ["superadmin", "editor", "advisor"] },
  { to: "/admin/settings", label: "Site settings", icon: Settings, roles: ["superadmin", "editor"] },
  { to: "/admin/users", label: "Users & roles", icon: ShieldCheck, roles: ["superadmin"] },
  { to: "/admin/activity", label: "Activity log", icon: History, roles: ["superadmin"] },
];

export function AdminLayout() {
  const { me, ready, logout } = useAuth(); const [open, setOpen] = useState(false); const loc = useLocation();
  if (!ready) return <div className="min-h-screen bg-ivory" />;
  if (!me) return <Navigate to="/admin/login" state={{ from: loc.pathname }} replace />;
  const nav = NAV.filter((n) => n.roles.includes(me.role));
  const side = (
    <nav aria-label="Admin" className="flex h-full flex-col bg-navy text-white">
      <div className="flex h-16 items-center justify-between px-5"><Logo /><button className="p-1 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button></div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">{nav.map((n) => <li key={n.to}><NavLink to={n.to} end={n.to === "/admin"} onClick={() => setOpen(false)} className={({ isActive }) => `flex min-h-[44px] items-center gap-3 px-3 text-sm transition-colors ${isActive ? "bg-white/10 text-gold" : "text-white/70 hover:bg-white/5 hover:text-white"}`}><n.icon className="h-4 w-4" aria-hidden />{n.label}</NavLink></li>)}</ul>
      <div className="border-t border-white/10 p-4 text-xs"><p className="truncate text-white/80">{me.name}</p><p className="mb-3 uppercase tracking-widest text-gold">{me.role}</p><button onClick={logout} className="flex items-center gap-2 text-white/70 hover:text-gold"><LogOut className="h-4 w-4" />Sign out</button></div>
    </nav>
  );
  return (
    <div className="min-h-screen bg-[#EFEDE6] lg:grid lg:grid-cols-[250px_1fr]">
      <Helmet><meta name="robots" content="noindex,nofollow" /><title>Admin | MetaWealth Capital</title></Helmet>
      <aside className="hidden lg:block"><div className="sticky top-0 h-screen">{side}</div></aside>
      {open && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 left-0 w-64">{side}</div></div>}
      <div className="min-w-0">
        <header className="flex h-14 items-center border-b border-navy/10 bg-white px-4 lg:hidden"><button aria-label="Open menu" onClick={() => setOpen(true)} className="p-1"><Menu /></button><span className="ml-3 font-serif">Admin</span></header>
        <main className="p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
