import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ImageSlot } from "@/components/ImageSlot";
import { Reveal, SectionHeading } from "@/components/Motion";
import { useFetch } from "@/hooks/useFetch";
import { fmtDate } from "@/lib";
import { articlePhoto } from "@/photos";

export interface Article { _id: string; slug: string; title: string; category: string; excerpt: string; image?: string; publishedAt: string; readingMinutes: number; body?: string[] }
const OFFSET = ["md:mt-0", "md:mt-12", "md:mt-24"];

export function ArticleCard({ a, i = 0, stagger = false, plain = false }: { a: Article; i?: number; stagger?: boolean; plain?: boolean }) {
  const body = (
    <Link to={`/insights/${a.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy">
        <div className="h-full w-full transition-transform duration-[900ms] group-hover:scale-105"><ImageSlot src={a.image} photo={articlePhoto(a.slug)} alt="" sizes="(min-width:768px) 33vw, 80vw" /></div>
        <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-navy"><ArrowUpRight className="h-5 w-5" aria-hidden /></span>
      </div>
      <div className="mt-5 flex items-center justify-between text-[11px] font-bold uppercase tracking-[.14em] text-muted"><span>{a.category}</span><span>{a.readingMinutes} min read</span></div>
      <h3 className="mt-3 font-serif text-[2rem] leading-[1.02] text-navy group-hover:text-coral">{a.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{a.excerpt}</p>
      <p className="mt-4 flex items-center justify-between text-xs text-muted"><time dateTime={a.publishedAt}>{fmtDate(a.publishedAt)}</time><span className="border-b border-navy pb-1 font-bold text-navy">Read article</span></p>
    </Link>
  );
  return plain ? <article className={stagger ? OFFSET[i % 3] : ""}>{body}</article> : <Reveal as="article" delay={(i % 3) * 0.08} className={stagger ? OFFSET[i % 3] : ""}>{body}</Reveal>;
}

/** 08 / Insights. */
export function InsightsSection() {
  const { data } = useFetch<{ items: Article[] }>("/articles?limit=3", { items: [] });
  const items = data?.items || [];
  if (!items.length) return null;
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="08 / Financial insights" title="Perspectives That Help You Think Ahead." />
          <Reveal><Link to="/insights" className="link-arrow text-navy">All insights <ArrowUpRight className="h-4 w-4" aria-hidden /></Link></Reveal>
        </div>
        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-x-8 md:overflow-visible md:px-0 md:pb-24">{items.map((a, i) => <div key={a._id} className="w-[80%] shrink-0 snap-start sm:w-[52%] md:w-auto"><ArticleCard a={a} i={i} stagger plain /></div>)}</div>
      </div>
    </section>
  );
}
