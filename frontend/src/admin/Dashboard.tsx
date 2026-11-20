import { Link } from "react-router-dom";
import { Inbox, CalendarCheck, Mail, FileText, Briefcase, Users } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "./auth";

export default function Dashboard() {
  const { me } = useAuth();
  const { data, loading } = useFetch<any>("/admin/stats");
  const tiles = data ? [
    ["Enquiries", data.enquiries, `${data.newEnquiries} new`, Inbox, "/admin/enquiries"],
    ["Bookings", data.bookings, `${data.pendingBookings} pending`, CalendarCheck, "/admin/bookings"],
    ["Subscribers", data.subscribers, "active", Mail, "/admin/subscribers"],
    ["Published articles", data.articles, "", FileText, "/admin/articles"],
    ["Published services", data.services, "", Briefcase, "/admin/services"],
    ["Published team profiles", data.team, "", Users, "/admin/team"],
  ] as const : [];
  return (
    <div>
      <h1 className="font-serif text-3xl">Welcome, {me?.name}</h1><p className="mt-1 text-sm text-muted">Overview of website activity.</p>
      {loading ? <p className="mt-8 text-muted">Loading…</p> : (<>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{tiles.map(([l, n, s, I, to]) => <Link key={l} to={to} className="group border border-navy/10 bg-white p-6 transition-shadow hover:shadow-soft"><I className="h-6 w-6 text-gold" strokeWidth={1.4} /><p className="mt-4 font-serif text-4xl">{n}</p><p className="text-sm">{l}</p>{s && <p className="text-xs text-muted">{s}</p>}</Link>)}</div>
        <h2 className="mb-3 mt-12 font-serif text-xl">Recent activity</h2>
        <div className="border border-navy/10 bg-white">{data.recent.length ? data.recent.map((r: any) => <div key={r._id} className="flex flex-wrap justify-between gap-2 border-b border-navy/5 px-5 py-3 text-sm last:border-0"><span><strong className="capitalize">{r.action}</strong> {r.entity}{r.detail ? ` · ${r.detail}` : ""}</span><span className="text-muted">{r.userEmail} · {new Date(r.createdAt).toLocaleString("en-GB")}</span></div>) : <p className="p-5 text-sm text-muted">No activity yet.</p>}</div>
      </>)}
    </div>
  );
}
