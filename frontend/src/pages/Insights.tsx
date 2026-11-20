import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { ARTICLE_CATEGORIES } from "@shared/content";
import { PageHero, Seo } from "@/components/PageHero";
import { ArticleCard, Article } from "@/sections/Insights";
import { NewsletterForm } from "@/components/NewsletterForm";
import { useFetch } from "@/hooks/useFetch";
import { qs } from "@/services/api";

export default function Insights() {
  const [sp, setSp] = useSearchParams();
  const category = sp.get("category") || "", page = Number(sp.get("page") || 1), q = sp.get("q") || "";
  const [term, setTerm] = useState(q);
  useEffect(() => { const t = setTimeout(() => { if (term !== q) { const n = new URLSearchParams(sp); term ? n.set("q", term) : n.delete("q"); n.delete("page"); setSp(n); } }, 350); return () => clearTimeout(t); }, [term]); // eslint-disable-line
  const { data, loading, error } = useFetch<{ items: Article[]; pages: number; total: number }>(`/articles${qs({ category, page, q, limit: 6 })}`);
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); if (k !== "page") n.delete("page"); setSp(n); };
  return (
    <>
      <Seo title="Insights" description="Financial perspectives and education on wealth management, investment planning, tax strategy, retirement and estate planning from MetaWealth Capital." />
      <PageHero eyebrow="Insights" title="Perspectives That Help You Think Ahead." intro="Financial education and planning perspectives. General information only, not personal advice." crumbs={[{ name: "Insights", path: "/insights" }]} variant="grid" />
      <section className="section"><div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {["", ...ARTICLE_CATEGORIES].map((c) => <button key={c || "all"} aria-pressed={category === c} onClick={() => set("category", c)} className={`min-h-[44px] border px-4 text-xs font-semibold uppercase tracking-wider transition-colors ${category === c ? "border-navy bg-navy text-white" : "border-navy/20 hover:border-gold"}`}>{c || "All"}</button>)}
          </div>
          <div className="relative w-full lg:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden /><label htmlFor="s" className="sr-only">Search articles</label><input id="s" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search articles" className="field !pl-10" /></div>
        </div>
        <div className="mt-12" aria-live="polite">
          {error ? <p className="text-center text-muted">Insights are temporarily unavailable. Please try again shortly.</p>
            : loading ? <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-96 animate-pulse bg-navy/5" />)}</div>
            : data?.items.length ? <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{data.items.map((a, i) => <ArticleCard key={a._id} a={a} i={i} />)}</div>
            : <p className="py-16 text-center text-muted">No articles match your search.</p>}
        </div>
        {data && data.pages > 1 && (
          <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
            <button disabled={page <= 1} onClick={() => set("page", String(page - 1))} className="btn btn-outline-dark !min-h-[44px] !px-4">Previous</button>
            {Array.from({ length: data.pages }).map((_, i) => <button key={i} aria-current={page === i + 1 ? "page" : undefined} onClick={() => set("page", String(i + 1))} className={`h-11 w-11 border text-sm ${page === i + 1 ? "border-navy bg-navy text-white" : "border-navy/20"}`}>{i + 1}</button>)}
            <button disabled={page >= data.pages} onClick={() => set("page", String(page + 1))} className="btn btn-outline-dark !min-h-[44px] !px-4">Next</button>
          </nav>)}
      </div></section>
      <section className="bg-navy py-16"><div className="container-x grid items-center gap-8 lg:grid-cols-2"><div><h2 className="font-serif text-3xl !text-white">Insights in your inbox</h2><p className="mt-3 text-white/60">Occasional perspectives on wealth, planning and markets.</p></div><div className="relative"><NewsletterForm /></div></div></section>
    </>
  );
}
