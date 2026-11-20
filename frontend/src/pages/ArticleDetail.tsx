import { Link, useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { RISK_DISCLOSURE } from "@shared/content";
import { PageHero, Seo } from "@/components/PageHero";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { ImageSlot } from "@/components/ImageSlot";
import { Article } from "@/sections/Insights";
import { useFetch } from "@/hooks/useFetch";
import { fmtDate } from "@/lib";
import NotFound from "./NotFound";

export default function ArticleDetail() {
  const { slug = "" } = useParams();
  const { data: a, loading, error } = useFetch<Article & { seoTitle?: string; seoDescription?: string }>(`/articles/${slug}`);
  if (loading) return <div className="min-h-screen bg-navy" />;
  if (error || !a) return <NotFound />;
  return (
    <>
      <Seo title={a.seoTitle || a.title} description={a.seoDescription || a.excerpt} type="article" image={a.image} jsonLd={{ "@context": "https://schema.org", "@type": "Article", headline: a.title, datePublished: a.publishedAt, description: a.excerpt, publisher: { "@type": "Organization", name: "MetaWealth Capital" } }} />
      <PageHero eyebrow={a.category} title={a.title} crumbs={[{ name: "Insights", path: "/insights" }, { name: a.title, path: `/insights/${a.slug}` }]} variant="grid" />
      <article className="section"><div className="container-x">
        <div className="mx-auto max-w-3xl">
          <p className="flex items-center gap-4 border-b border-navy/10 pb-6 text-sm text-muted"><time dateTime={a.publishedAt}>{fmtDate(a.publishedAt)}</time><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{a.readingMinutes} min read</span></p>
          {a.image && <div className="my-8 aspect-[16/9] overflow-hidden"><ImageSlot src={a.image} alt="" /></div>}
          <div className="prose-mw mt-8 text-lg">{a.body?.map((p, i) => <p key={i}>{p}</p>)}</div>
          <p className="mt-10 border-l-2 border-gold bg-white p-5 text-xs leading-relaxed text-muted">{RISK_DISCLOSURE}</p>
          <p className="mt-10"><Link to="/insights" className="text-sm underline underline-offset-4">← All insights</Link></p>
        </div>
      </div></article>
      <ConsultationCTA />
    </>
  );
}
