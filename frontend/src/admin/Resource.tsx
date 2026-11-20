import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { api, ApiError, qs } from "@/services/api";
import { useFetch } from "@/hooks/useFetch";
import { slugify } from "@/lib";
import { Modal, Confirm, Pager, Badge, Toast } from "./ui";

export type FieldType = "text" | "textarea" | "number" | "bool" | "select" | "list" | "faqs" | "image" | "date" | "url";
export interface Field { name: string; label: string; type: FieldType; options?: string[]; hint?: string; required?: boolean }
export interface Column { key: string; label: string; render?: (row: any) => React.ReactNode }

function FieldInput({ f, value, onChange, error }: { f: Field; value: any; onChange: (v: any) => void; error?: string }) {
  const id = `f-${f.name}`;
  const media = useFetch<{ items: { _id: string; url: string; alt?: string }[] }>(f.type === "image" ? "/admin/media?limit=100" : null);
  let input: React.ReactNode;
  switch (f.type) {
    case "textarea": input = <textarea id={id} rows={4} className="field" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />; break;
    case "number": input = <input id={id} type="number" className="field" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />; break;
    case "date": input = <input id={id} type="date" className="field" value={value ? String(value).slice(0, 10) : ""} onChange={(e) => onChange(e.target.value)} />; break;
    case "bool": input = <label className="flex items-center gap-2 text-sm"><input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="accent-[#F8BC4F]" />{f.hint || "Enabled"}</label>; break;
    case "select": input = <select id={id} className="field" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>; break;
    case "list": input = <textarea id={id} rows={4} className="field" placeholder="One item per line" value={(value || []).join("\n")} onChange={(e) => onChange(e.target.value.split("\n"))} onBlur={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} />; break;
    case "faqs": input = (
      <div className="space-y-3">{(value || []).map((q: any, i: number) => (
        <div key={i} className="space-y-2 border border-navy/10 p-3">
          <input aria-label={`Question ${i + 1}`} className="field" placeholder="Question" value={q.q} onChange={(e) => onChange(value.map((x: any, k: number) => k === i ? { ...x, q: e.target.value } : x))} />
          <textarea aria-label={`Answer ${i + 1}`} rows={2} className="field" placeholder="Answer" value={q.a} onChange={(e) => onChange(value.map((x: any, k: number) => k === i ? { ...x, a: e.target.value } : x))} />
          <button type="button" className="text-xs text-red-700 underline" onClick={() => onChange(value.filter((_: any, k: number) => k !== i))}>Remove</button>
        </div>))}
        <button type="button" className="text-sm underline" onClick={() => onChange([...(value || []), { q: "", a: "" }])}>+ Add question</button></div>); break;
    case "image": input = (
      <div><input id={id} className="field" placeholder="/uploads/… or https://…" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
        {media.data?.items.length ? <div className="mt-2 flex flex-wrap gap-2">{media.data.items.map((m) => <button type="button" key={m._id} onClick={() => onChange(m.url)} className={`h-14 w-14 overflow-hidden border-2 ${value === m.url ? "border-gold" : "border-transparent"}`}><img src={m.url} alt={m.alt || ""} className="h-full w-full object-cover" /></button>)}</div> : null}</div>); break;
    default: input = <input id={id} type={f.type === "url" ? "url" : "text"} className="field" value={value ?? ""} onChange={(e) => onChange(f.name === "title" || f.name === "name" ? e.target.value : e.target.value)} />;
  }
  return <div><label className="label" htmlFor={id}>{f.label}{f.required ? " *" : ""}</label>{input}{f.hint && f.type !== "bool" && <p className="mt-1 text-xs text-muted">{f.hint}</p>}{error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}</div>;
}

export function ResourcePage({ title, endpoint, columns, fields, defaults, searchHint, categories, publishable = true, slugFrom }: {
  title: string; endpoint: string; columns: Column[]; fields: Field[]; defaults: any; searchHint: string; categories?: string[]; publishable?: boolean; slugFrom?: string;
}) {
  const [page, setPage] = useState(1); const [q, setQ] = useState(""); const [dq, setDq] = useState(""); const [pub, setPub] = useState(""); const [cat, setCat] = useState("");
  useEffect(() => { const t = setTimeout(() => { setDq(q); setPage(1); }, 300); return () => clearTimeout(t); }, [q]);
  const { data, loading, reload, error } = useFetch<{ items: any[]; total: number; pages: number }>(`/admin/${endpoint}${qs({ page, q: dq, published: pub, category: cat, limit: 10 })}`);
  const [editing, setEditing] = useState<any | null>(null); const [isNew, setIsNew] = useState(false);
  const [del, setDel] = useState<any | null>(null); const [errs, setErrs] = useState<Record<string, string>>({}); const [msg, setMsg] = useState<{ t: string; tone: "ok" | "err" }>({ t: "", tone: "ok" }); const [busy, setBusy] = useState(false);
  const toast = useCallback((t: string, tone: "ok" | "err" = "ok") => { setMsg({ t, tone }); setTimeout(() => setMsg({ t: "", tone }), 3200); }, []);

  const open = (row?: any) => { setErrs({}); setIsNew(!row); setEditing(row ? { ...row } : { ...defaults }); };
  const set = (name: string, v: any) => setEditing((e: any) => {
    const n = { ...e, [name]: v };
    if (isNew && slugFrom && name === slugFrom && (!e.slug || e.slug === slugify(e[slugFrom] || ""))) n.slug = slugify(String(v));
    return n;
  });
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErrs({});
    const body: any = {}; fields.forEach((f) => { body[f.name] = editing[f.name]; if (f.type === "list") body[f.name] = (editing[f.name] || []).map((s: string) => s.trim()).filter(Boolean); });
    body.slug = editing.slug; if (publishable) body.published = !!editing.published;
    try { isNew ? await api.post(`/admin/${endpoint}`, body) : await api.put(`/admin/${endpoint}/${editing._id}`, body); toast(isNew ? "Created" : "Saved"); setEditing(null); reload(); }
    catch (x) { if (x instanceof ApiError) { setErrs(x.fields || { _: x.message }); toast(x.message, "err"); } else toast("Save failed", "err"); } finally { setBusy(false); }
  }
  async function togglePub(row: any) { try { await api.patch(`/admin/${endpoint}/${row._id}/publish`, { published: !row.published }); toast(row.published ? "Unpublished" : "Published"); reload(); } catch (x: any) { toast(x.message, "err"); } }
  async function remove() { try { await api.del(`/admin/${endpoint}/${del._id}`); toast("Deleted"); setDel(null); reload(); } catch (x: any) { toast(x.message, "err"); } }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="font-serif text-3xl">{title}</h1><button className="btn btn-navy !min-h-[44px]" onClick={() => open()}><Plus className="h-4 w-4" />New</button></div>
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input aria-label="Search" className="field !pl-9" placeholder={searchHint} value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {publishable && <select aria-label="Filter by status" className="field !w-auto" value={pub} onChange={(e) => { setPub(e.target.value); setPage(1); }}><option value="">All statuses</option><option value="true">Published</option><option value="false">Draft</option></select>}
        {categories && <select aria-label="Filter by category" className="field !w-auto" value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>}
      </div>
      <div className="mt-4 overflow-x-auto border border-navy/10 bg-white">
        <table className="w-full text-left text-sm"><thead className="bg-navy/5 text-xs uppercase tracking-wider text-navy/70"><tr>{columns.map((c) => <th key={c.key} className="px-4 py-3">{c.label}</th>)}{publishable && <th className="px-4 py-3">Status</th>}<th className="px-4 py-3 text-right">Actions</th></tr></thead>
          <tbody>{loading ? <tr><td className="p-6 text-muted" colSpan={9}>Loading…</td></tr> : error ? <tr><td className="p-6 text-red-700" colSpan={9}>{error}</td></tr> : data?.items.length ? data.items.map((r) => (
            <tr key={r._id} className="border-t border-navy/5">{columns.map((c) => <td key={c.key} className="px-4 py-3">{c.render ? c.render(r) : r[c.key]}</td>)}{publishable && <td className="px-4 py-3"><Badge tone={r.published ? "green" : "gray"}>{r.published ? "Published" : "Draft"}</Badge></td>}
              <td className="whitespace-nowrap px-4 py-3 text-right">
                {publishable && <button className="p-2 hover:text-gold" aria-label={r.published ? `Unpublish ${r.title || r.name}` : `Publish ${r.title || r.name}`} onClick={() => togglePub(r)}>{r.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                <button className="p-2 hover:text-gold" aria-label={`Edit ${r.title || r.name}`} onClick={() => open(r)}><Pencil className="h-4 w-4" /></button>
                <button className="p-2 hover:text-red-700" aria-label={`Delete ${r.title || r.name}`} onClick={() => setDel(r)}><Trash2 className="h-4 w-4" /></button></td></tr>)) : <tr><td className="p-6 text-muted" colSpan={9}>Nothing found.</td></tr>}</tbody></table>
      </div>
      {data && <Pager page={page} pages={data.pages} total={data.total} set={setPage} />}
      {editing && (
        <Modal wide title={`${isNew ? "New" : "Edit"} ${title.toLowerCase()}`} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4" noValidate>
            {fields.map((f) => <FieldInput key={f.name} f={f} value={editing[f.name]} onChange={(v) => set(f.name, v)} error={errs[f.name]} />)}
            <div><label className="label" htmlFor="f-slug">URL slug *</label><input id="f-slug" className="field" value={editing.slug || ""} onChange={(e) => set("slug", slugify(e.target.value))} />{errs.slug && <p role="alert" className="mt-1 text-xs text-red-600">{errs.slug}</p>}</div>
            {publishable && <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[#F8BC4F]" checked={!!editing.published} onChange={(e) => set("published", e.target.checked)} />Published (visible on the website)</label>}
            {errs._ && <p role="alert" className="text-sm text-red-600">{errs._}</p>}
            <div className="flex justify-end gap-3 border-t border-navy/10 pt-4"><button type="button" className="btn btn-outline-dark !min-h-[40px]" onClick={() => setEditing(null)}>Cancel</button><button className="btn btn-navy !min-h-[40px]" disabled={busy}>{busy ? "Saving…" : "Save"}</button></div>
          </form>
        </Modal>)}
      {del && <Confirm title="Delete record" text={`Permanently delete "${del.title || del.name}"? This cannot be undone.`} onConfirm={remove} onCancel={() => setDel(null)} />}
      <Toast msg={msg.t} tone={msg.tone} />
    </div>
  );
}
