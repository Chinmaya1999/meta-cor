import { useEffect, useState } from "react";
import { Trash2, Upload, Copy, Download } from "lucide-react";
import { ARTICLE_CATEGORIES } from "@shared/content";
import { api, ApiError, qs } from "@/services/api";
import { useFetch } from "@/hooks/useFetch";
import { ResourcePage } from "./Resource";
import { Modal, Confirm, Pager, Badge, Toast } from "./ui";

export const ServicesAdmin = () => <ResourcePage title="Services" endpoint="services" searchHint="Search services" slugFrom="title" defaults={{ icon: "Compass", order: 0, published: true, challenges: [], howItWorks: [], expertise: [], faqs: [] }}
  columns={[{ key: "order", label: "#" }, { key: "title", label: "Title" }, { key: "slug", label: "Slug" }]}
  fields={[{ name: "title", label: "Title", type: "text", required: true }, { name: "icon", label: "Icon name", type: "select", options: ["Compass", "LineChart", "Landmark", "Sunset", "Scale", "TreePine", "ShieldCheck"] }, { name: "order", label: "Display order", type: "number" }, { name: "tagline", label: "Tagline", type: "text" }, { name: "summary", label: "Short summary (cards)", type: "textarea" }, { name: "overview", label: "Overview", type: "textarea" }, { name: "challenges", label: "Client challenges", type: "list" }, { name: "howItWorks", label: "How it works (steps)", type: "list" }, { name: "expertise", label: "Relevant expertise", type: "list" }, { name: "faqs", label: "FAQs", type: "faqs" }, { name: "image", label: "Hero / card image", type: "image" }, { name: "seoTitle", label: "SEO title (max 70)", type: "text" }, { name: "seoDescription", label: "SEO description (max 170)", type: "textarea" }]} />;

export const TeamAdmin = () => <ResourcePage title="Team" endpoint="team" searchHint="Search by name or title" slugFrom="name" defaults={{ order: 0, published: false, qualifications: [], expertise: [] }}
  columns={[{ key: "name", label: "Name" }, { key: "title", label: "Job title" }]}
  fields={[{ name: "name", label: "Full name", type: "text", required: true }, { name: "title", label: "Actual job title", type: "text", required: true }, { name: "photo", label: "Genuine professional photograph", type: "image" }, { name: "qualifications", label: "Verified qualifications", type: "list", hint: "Only list qualifications you have verified." }, { name: "experience", label: "Professional experience", type: "textarea" }, { name: "expertise", label: "Expertise", type: "list" }, { name: "bio", label: "Biography", type: "textarea" }, { name: "linkedin", label: "LinkedIn URL", type: "url" }, { name: "order", label: "Display order", type: "number" }]} />;

export const ArticlesAdmin = () => <ResourcePage title="Insights" endpoint="articles" searchHint="Search articles" categories={ARTICLE_CATEGORIES} slugFrom="title" defaults={{ category: ARTICLE_CATEGORIES[0], published: false, body: [], readingMinutes: 4, publishedAt: new Date().toISOString().slice(0, 10) }}
  columns={[{ key: "title", label: "Title" }, { key: "category", label: "Category" }, { key: "publishedAt", label: "Date", render: (r) => new Date(r.publishedAt).toLocaleDateString("en-GB") }]}
  fields={[{ name: "title", label: "Title", type: "text", required: true }, { name: "category", label: "Category", type: "select", options: ARTICLE_CATEGORIES }, { name: "excerpt", label: "Short description", type: "textarea" }, { name: "body", label: "Article body", type: "list", hint: "One paragraph per line." }, { name: "image", label: "Editorial image", type: "image" }, { name: "publishedAt", label: "Published date", type: "date" }, { name: "readingMinutes", label: "Reading time (minutes)", type: "number" }, { name: "seoTitle", label: "SEO title", type: "text" }, { name: "seoDescription", label: "SEO description", type: "textarea" }]} />;

function Leads({ title, endpoint, statuses, tone, columns }: { title: string; endpoint: string; statuses: string[]; tone: (s: string) => any; columns: [string, (r: any) => React.ReactNode][] }) {
  const [page, setPage] = useState(1); const [q, setQ] = useState(""); const [dq, setDq] = useState(""); const [status, setStatus] = useState("");
  useEffect(() => { const t = setTimeout(() => { setDq(q); setPage(1); }, 300); return () => clearTimeout(t); }, [q]);
  const { data, loading, reload } = useFetch<{ items: any[]; total: number; pages: number }>(`/admin/${endpoint}${qs({ page, q: dq, status, limit: 10 })}`);
  const [sel, setSel] = useState<any>(null); const [notes, setNotes] = useState(""); const [del, setDel] = useState<any>(null); const [msg, setMsg] = useState("");
  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };
  const patch = async (id: string, body: any) => { try { await api.patch(`/admin/${endpoint}/${id}`, body); flash("Updated"); reload(); } catch (e: any) { flash(e.message); } };
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="font-serif text-3xl">{title}</h1>
        {endpoint === "subscribers" && <a className="btn btn-outline-dark !min-h-[44px]" href="/api/admin/subscribers/export"><Download className="h-4 w-4" />Export CSV</a>}</div>
      <div className="mt-6 flex flex-wrap gap-3"><input aria-label="Search" className="field min-w-[220px] flex-1" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} /><select aria-label="Filter by status" className="field !w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="mt-4 overflow-x-auto border border-navy/10 bg-white"><table className="w-full text-left text-sm"><thead className="bg-navy/5 text-xs uppercase tracking-wider text-navy/70"><tr>{columns.map(([h]) => <th key={h} className="px-4 py-3">{h}</th>)}<th className="px-4 py-3">Status</th><th className="px-4 py-3">Received</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
        <tbody>{loading ? <tr><td className="p-6 text-muted" colSpan={9}>Loading…</td></tr> : data?.items.length ? data.items.map((r) => (
          <tr key={r._id} className="border-t border-navy/5">{columns.map(([h, f]) => <td key={h} className="px-4 py-3">{f(r)}</td>)}
            <td className="px-4 py-3"><select aria-label="Status" className="border border-navy/15 bg-white px-2 py-1 text-xs" value={r.status} onChange={(e) => patch(r._id, { status: e.target.value })}>{statuses.map((s) => <option key={s}>{s}</option>)}</select> <Badge tone={tone(r.status)}>{r.status}</Badge></td>
            <td className="whitespace-nowrap px-4 py-3 text-muted">{new Date(r.createdAt).toLocaleDateString("en-GB")}</td>
            <td className="whitespace-nowrap px-4 py-3 text-right">{endpoint !== "subscribers" && <button className="mr-2 text-xs underline" onClick={() => { setSel(r); setNotes(r.notes || ""); }}>View</button>}<button className="p-2 hover:text-red-700" aria-label="Delete" onClick={() => setDel(r)}><Trash2 className="h-4 w-4" /></button></td></tr>)) : <tr><td className="p-6 text-muted" colSpan={9}>Nothing found.</td></tr>}</tbody></table></div>
      {data && <Pager page={page} pages={data.pages} total={data.total} set={setPage} />}
      {sel && <Modal wide title="Details" onClose={() => setSel(null)}><dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">{Object.entries(sel).filter(([k]) => !["_id", "__v", "notes", "ip", "updatedAt"].includes(k)).map(([k, v]) => <div key={k} className={k === "message" ? "sm:col-span-2" : ""}><dt className="text-xs uppercase tracking-wider text-muted">{k}</dt><dd className="whitespace-pre-wrap break-words">{String(v)}</dd></div>)}</dl>
        <label className="label mt-6" htmlFor="notes">Internal notes</label><textarea id="notes" rows={3} className="field" value={notes} onChange={(e) => setNotes(e.target.value)} /><div className="mt-4 flex justify-end"><button className="btn btn-navy !min-h-[40px]" onClick={() => { patch(sel._id, { notes }); setSel(null); }}>Save notes</button></div></Modal>}
      {del && <Confirm title="Delete record" text="Permanently delete this record?" onConfirm={async () => { try { await api.del(`/admin/${endpoint}/${del._id}`); flash("Deleted"); } catch (e: any) { flash(e.message); } setDel(null); reload(); }} onCancel={() => setDel(null)} />}
      <Toast msg={msg} />
    </div>
  );
}
const tone = (s: string) => (["new", "pending"].includes(s) ? "gold" : ["confirmed", "active", "completed", "contacted"].includes(s) ? "green" : ["spam", "cancelled"].includes(s) ? "red" : "gray");
export const EnquiriesAdmin = () => <Leads title="Enquiries" endpoint="enquiries" statuses={["new", "contacted", "closed", "spam"]} tone={tone} columns={[["Name", (r) => <><strong>{r.fullName}</strong><br /><span className="text-xs text-muted">{r.email}</span></>], ["Interest", (r) => r.areaOfInterest], ["Country", (r) => r.country]]} />;
export const BookingsAdmin = () => <Leads title="Consultation bookings" endpoint="bookings" statuses={["pending", "confirmed", "cancelled", "completed"]} tone={tone} columns={[["Name", (r) => <><strong>{r.fullName}</strong><br /><span className="text-xs text-muted">{r.email}</span></>], ["Type", (r) => r.type], ["When (Dubai)", (r) => `${r.date} ${r.time}`]]} />;
export const SubscribersAdmin = () => <Leads title="Newsletter subscribers" endpoint="subscribers" statuses={["pending", "active", "unsubscribed"]} tone={tone} columns={[["Email", (r) => r.email]]} />;

export function MediaAdmin() {
  const [page, setPage] = useState(1);
  const { data, reload } = useFetch<{ items: any[]; total: number; pages: number }>(`/admin/media?page=${page}&limit=24`);
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(""); const [del, setDel] = useState<any>(null); const [alt, setAlt] = useState("");
  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };
  async function up(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    if (!alt.trim()) { flash("Add descriptive alt text first"); e.target.value = ""; return; }
    const fd = new FormData(); fd.append("alt", alt); fd.append("file", file); setBusy(true);
    try { await api.post("/admin/media", fd); setAlt(""); flash("Uploaded"); reload(); } catch (x) { flash(x instanceof ApiError ? x.message : "Upload failed"); } finally { setBusy(false); e.target.value = ""; }
  }
  return (
    <div><h1 className="font-serif text-3xl">Media library</h1><p className="mt-1 text-sm text-muted">JPG, PNG, WebP or AVIF up to 8 MB. Only upload images you are licensed to use.</p>
      <div className="mt-6 flex flex-wrap items-end gap-3 border border-navy/10 bg-white p-4"><div className="min-w-[240px] flex-1"><label className="label" htmlFor="alt">Alt text (describe the image) *</label><input id="alt" className="field" value={alt} onChange={(e) => setAlt(e.target.value)} /></div>
        <label className={`btn btn-navy !min-h-[48px] cursor-pointer ${busy ? "opacity-60" : ""}`}><Upload className="h-4 w-4" />{busy ? "Uploading…" : "Choose image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={up} disabled={busy} /></label></div>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{data?.items.map((m) => <li key={m._id} className="border border-navy/10 bg-white"><img src={m.url} alt={m.alt || ""} className="aspect-[4/3] w-full object-cover" loading="lazy" /><div className="flex items-center justify-between p-2 text-xs"><span className="truncate" title={m.alt}>{m.alt}</span><span className="flex shrink-0"><button aria-label="Copy URL" className="p-1.5 hover:text-gold" onClick={() => { navigator.clipboard?.writeText(m.url); flash("URL copied"); }}><Copy className="h-3.5 w-3.5" /></button><button aria-label="Delete image" className="p-1.5 hover:text-red-700" onClick={() => setDel(m)}><Trash2 className="h-3.5 w-3.5" /></button></span></div></li>)}</ul>
      {data && !data.items.length && <p className="mt-8 text-muted">No images yet.</p>}
      {data && <Pager page={page} pages={data.pages} total={data.total} set={setPage} />}
      {del && <Confirm title="Delete image" text="Delete this image? Pages using it will fall back to the default artwork." onConfirm={async () => { await api.del(`/admin/media/${del._id}`).catch(() => {}); setDel(null); reload(); }} onCancel={() => setDel(null)} />}
      <Toast msg={msg} /></div>
  );
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export function SettingsAdmin() {
  const { data, loading } = useFetch<any>("/admin/settings");
  const [site, setSite] = useState<any>(null); const [av, setAv] = useState<any>(null); const [msg, setMsg] = useState("");
  useEffect(() => { if (data) { setSite({ phone: "", email: "", address: "", regulatoryStatement: "", ...(data.site || {}), social: { linkedin: "", instagram: "", x: "", ...(data.site?.social || {}) } }); setAv({ days: [1, 2, 3, 4, 5], start: "10:00", end: "17:00", slotMinutes: 60, leadDays: 1, horizonDays: 45, blockedDates: [], timezone: "Asia/Dubai (GST, UTC+4)", ...(data.availability || {}) }); } }, [data]);
  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };
  const save = async (key: string, v: any) => { try { await api.put(`/admin/settings/${key}`, v); flash("Saved"); } catch (e: any) { flash(e.message); } };
  if (loading || !site || !av) return <p className="text-muted">Loading…</p>;
  return (
    <div className="max-w-3xl space-y-12"><h1 className="font-serif text-3xl">Site settings</h1>
      <form className="space-y-4 border border-navy/10 bg-white p-6" onSubmit={(e) => { e.preventDefault(); save("site", site); }}><h2 className="font-serif text-xl">Contact & compliance</h2><p className="text-xs text-muted">Only enter details you have verified. Empty fields are not shown on the website. Entering a street address enables the Google Map.</p>
        {([["phone", "Phone"], ["email", "Public email"], ["address", "Office street address"]] as const).map(([k, l]) => <div key={k}><label className="label" htmlFor={k}>{l}</label><input id={k} className="field" value={site[k]} onChange={(e) => setSite({ ...site, [k]: e.target.value })} /></div>)}
        {(["linkedin", "instagram", "x"] as const).map((k) => <div key={k}><label className="label" htmlFor={`s-${k}`}>{k} URL</label><input id={`s-${k}`} type="url" className="field" value={site.social[k]} onChange={(e) => setSite({ ...site, social: { ...site.social, [k]: e.target.value } })} /></div>)}
        <div><label className="label" htmlFor="reg">Regulatory statement (footer)</label><textarea id="reg" rows={3} className="field" value={site.regulatoryStatement} onChange={(e) => setSite({ ...site, regulatoryStatement: e.target.value })} /><p className="mt-1 text-xs text-muted">Must be supplied by compliance. Never enter licences you do not hold.</p></div>
        <button className="btn btn-navy !min-h-[44px]">Save contact settings</button></form>
      <form className="space-y-4 border border-navy/10 bg-white p-6" onSubmit={(e) => { e.preventDefault(); save("availability", { ...av, slotMinutes: Number(av.slotMinutes), leadDays: Number(av.leadDays), horizonDays: Number(av.horizonDays) }); }}><h2 className="font-serif text-xl">Consultation availability</h2>
        <fieldset><legend className="label">Working days</legend><div className="flex flex-wrap gap-3">{DAYS.map((d, i) => <label key={d} className="flex items-center gap-1.5 text-sm"><input type="checkbox" className="accent-[#F8BC4F]" checked={av.days.includes(i)} onChange={(e) => setAv({ ...av, days: e.target.checked ? [...av.days, i] : av.days.filter((x: number) => x !== i) })} />{d}</label>)}</div></fieldset>
        <div className="grid gap-4 sm:grid-cols-3"><div><label className="label" htmlFor="st">Start</label><input id="st" type="time" className="field" value={av.start} onChange={(e) => setAv({ ...av, start: e.target.value })} /></div><div><label className="label" htmlFor="en">End</label><input id="en" type="time" className="field" value={av.end} onChange={(e) => setAv({ ...av, end: e.target.value })} /></div><div><label className="label" htmlFor="sl">Slot (minutes)</label><input id="sl" type="number" min={15} step={15} className="field" value={av.slotMinutes} onChange={(e) => setAv({ ...av, slotMinutes: e.target.value })} /></div><div><label className="label" htmlFor="ld">Minimum notice (days)</label><input id="ld" type="number" min={0} className="field" value={av.leadDays} onChange={(e) => setAv({ ...av, leadDays: e.target.value })} /></div><div><label className="label" htmlFor="hz">Bookable up to (days)</label><input id="hz" type="number" min={1} className="field" value={av.horizonDays} onChange={(e) => setAv({ ...av, horizonDays: e.target.value })} /></div></div>
        <div><label className="label" htmlFor="bd">Blocked dates (YYYY-MM-DD, one per line)</label><textarea id="bd" rows={3} className="field" value={av.blockedDates.join("\n")} onChange={(e) => setAv({ ...av, blockedDates: e.target.value.split("\n").map((s: string) => s.trim()).filter(Boolean) })} /></div>
        <button className="btn btn-navy !min-h-[44px]">Save availability</button></form>
      <Toast msg={msg} /></div>
  );
}

export function UsersAdmin() {
  const [page, setPage] = useState(1);
  const { data, reload } = useFetch<{ items: any[]; total: number; pages: number }>(`/admin/users?page=${page}&limit=10`);
  const [edit, setEdit] = useState<any>(null); const [del, setDel] = useState<any>(null); const [err, setErr] = useState(""); const [msg, setMsg] = useState("");
  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };
  async function save(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    try { const { _id, password, ...rest } = edit; const body: any = { name: rest.name, email: rest.email, role: rest.role, active: rest.active !== false }; if (password) body.password = password;
      _id ? await api.put(`/admin/users/${_id}`, body) : await api.post("/admin/users", { ...body, password }); flash("Saved"); setEdit(null); reload(); }
    catch (x) { setErr(x instanceof ApiError ? Object.values(x.fields || {}).join(". ") || x.message : "Failed"); }
  }
  return (
    <div><div className="flex items-center justify-between"><h1 className="font-serif text-3xl">Users & roles</h1><button className="btn btn-navy !min-h-[44px]" onClick={() => { setErr(""); setEdit({ role: "editor", active: true, password: "" }); }}>New user</button></div>
      <p className="mt-1 text-sm text-muted">Superadmin: everything. Editor: content and leads. Advisor: enquiries, bookings and subscribers.</p>
      <div className="mt-6 overflow-x-auto border border-navy/10 bg-white"><table className="w-full text-left text-sm"><thead className="bg-navy/5 text-xs uppercase tracking-wider"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
        <tbody>{data?.items.map((u) => <tr key={u._id} className="border-t border-navy/5"><td className="px-4 py-3">{u.name}</td><td className="px-4 py-3">{u.email}</td><td className="px-4 py-3 capitalize">{u.role}</td><td className="px-4 py-3"><Badge tone={u.active ? "green" : "red"}>{u.active ? "Active" : "Disabled"}</Badge></td><td className="px-4 py-3 text-right"><button className="mr-3 text-xs underline" onClick={() => { setErr(""); setEdit({ ...u, password: "" }); }}>Edit</button><button className="p-2 hover:text-red-700" aria-label={`Delete ${u.name}`} onClick={() => setDel(u)}><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>
      {data && <Pager page={page} pages={data.pages} total={data.total} set={setPage} />}
      {edit && <Modal title={edit._id ? "Edit user" : "New user"} onClose={() => setEdit(null)}><form onSubmit={save} className="space-y-4">
        <div><label className="label" htmlFor="un">Name</label><input id="un" className="field" required value={edit.name || ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
        <div><label className="label" htmlFor="ue">Email</label><input id="ue" type="email" className="field" required value={edit.email || ""} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></div>
        <div><label className="label" htmlFor="ur">Role</label><select id="ur" className="field" value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })}><option>superadmin</option><option>editor</option><option>advisor</option></select></div>
        <div><label className="label" htmlFor="up">{edit._id ? "New password (leave blank to keep)" : "Password"}</label><input id="up" type="password" autoComplete="new-password" className="field" required={!edit._id} value={edit.password} onChange={(e) => setEdit({ ...edit, password: e.target.value })} /><p className="mt-1 text-xs text-muted">12+ characters, with an uppercase letter and a number.</p></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[#F8BC4F]" checked={edit.active !== false} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} />Account active</label>
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}<div className="flex justify-end gap-3"><button type="button" className="btn btn-outline-dark !min-h-[40px]" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-navy !min-h-[40px]">Save</button></div></form></Modal>}
      {del && <Confirm title="Delete user" text={`Delete ${del.email}?`} onConfirm={async () => { try { await api.del(`/admin/users/${del._id}`); } catch (x: any) { flash(x.message); } setDel(null); reload(); }} onCancel={() => setDel(null)} />}
      <Toast msg={msg} /></div>
  );
}

export function ActivityAdmin() {
  const [page, setPage] = useState(1);
  const { data } = useFetch<{ items: any[]; total: number; pages: number }>(`/admin/activity?page=${page}&limit=20`);
  return (<div><h1 className="font-serif text-3xl">Activity log</h1><div className="mt-6 overflow-x-auto border border-navy/10 bg-white"><table className="w-full text-left text-sm"><thead className="bg-navy/5 text-xs uppercase tracking-wider"><tr><th className="px-4 py-3">When</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Detail</th></tr></thead><tbody>{data?.items.map((r) => <tr key={r._id} className="border-t border-navy/5"><td className="whitespace-nowrap px-4 py-3 text-muted">{new Date(r.createdAt).toLocaleString("en-GB")}</td><td className="px-4 py-3">{r.userEmail}</td><td className="px-4 py-3 capitalize">{r.action} {r.entity}</td><td className="px-4 py-3">{r.detail}</td></tr>)}</tbody></table></div>{data && <Pager page={page} pages={data.pages} total={data.total} set={setPage} />}</div>);
}
