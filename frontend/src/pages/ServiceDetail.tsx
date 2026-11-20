import { Link, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import { SERVICES, ServiceContent } from "@shared/content";
import { PageHero, Seo } from "@/components/PageHero";
import { ImageSlot } from "@/components/ImageSlot";
import { Accordion } from "@/components/Accordion";
import { Reveal, SectionHeading } from "@/components/Motion";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { Icon } from "@/components/Icon";
import { useFetch } from "@/hooks/useFetch";
import NotFound from "./NotFound";

export default function ServiceDetail() {
  const { slug = "" } = useParams();
  const local = SERVICES.find((s) => s.slug === slug);
  const { data, loading, error } = useFetch<ServiceContent & { image?: string; seoTitle?: string; seoDescription?: string }>(`/services/${slug}`, local);
  const s = data ?? local;
  if (loading && !s) return <div className="min-h-screen bg-navy" />;
  if (!s || (error && !local)) return <NotFound />;
  const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3);
  return (
    <>
      <Seo title={s.seoTitle || s.title} description={s.seoDescription || s.summary} image={s.image} jsonLd={{ "@context": "https://schema.org", "@type": "Service", name: s.title, description: s.summary, provider: { "@type": "FinancialService", name: "MetaWealth Capital" } }} />
      <PageHero eyebrow="Service" title={s.title} intro={s.tagline} image={s.image} crumbs={[{ name: "Services", path: "/services" }, { name: s.title, path: `/services/${s.slug}` }]} variant="grid" />
      <section className="section"><div className="container-x grid gap-14 lg:grid-cols-[1.3fr_.7fr]">
        <Reveal><Icon name={s.icon} className="mb-6 h-12 w-12 text-gold" /><h2 className="h-section">Overview</h2><span className="gold-rule mt-6" /><p className="mt-8 text-lg leading-[1.85] text-ink/85">{s.overview}</p>
          <h3 className="mt-14 font-serif text-2xl">Challenges we help with</h3>
          <ul className="mt-6 space-y-4">{s.challenges.map((c) => <li key={c} className="flex gap-4 border-b border-navy/10 pb-4"><Check className="mt-1 h-4 w-4 shrink-0 text-gold" aria-hidden /><span className="text-ink/85">{c}</span></li>)}</ul>
        </Reveal>
        <Reveal delay={0.1}><aside className="sticky top-28 space-y-6">
          <div className="aspect-[4/3] overflow-hidden"><ImageSlot src={s.image} alt={`${s.title}`} variant="horizon" /></div>
          <div className="bg-navy p-8"><p className="eyebrow mb-3">Relevant expertise</p><ul className="space-y-3 text-sm text-white/80">{s.expertise.map((e) => <li key={e} className="flex gap-3"><span className="mt-2 h-1 w-3 shrink-0 bg-gold" />{e}</li>)}</ul>
            <Link to="/book" className="btn btn-gold mt-8 w-full">Schedule a Consultation</Link></div>
        </aside></Reveal>
      </div></section>
      <section className="section bg-navy"><div className="container-x"><SectionHeading light eyebrow="How it works" title="Our Advisory Process for This Service" />
        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">{s.howItWorks.map((h, i) => <Reveal as="li" key={h} delay={i * 0.08} className="border-t border-gold/50 pt-6"><span className="font-serif text-4xl text-gold">{String(i + 1).padStart(2, "0")}</span><p className="mt-4 leading-relaxed text-white/75">{h}</p></Reveal>)}</ol>
        <p className="mt-10 text-sm"><Link to="/approach" className="inline-block py-2 text-gold underline underline-offset-4">View our full five-step approach</Link></p></div></section>
      <section className="section"><div className="container-x grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" /><Accordion items={s.faqs} /></div></section>
      <section className="bg-white section"><div className="container-x"><h2 className="font-serif text-3xl">Explore related services</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">{others.map((o) => <li key={o.slug}><Link to={`/services/${o.slug}`} className="group block border border-navy/10 p-7 transition-colors hover:border-gold"><Icon name={o.icon} className="h-8 w-8 text-gold" /><h3 className="mt-4 font-serif text-xl">{o.title}</h3><p className="mt-2 text-sm text-muted">{o.summary}</p></Link></li>)}</ul></div></section>
      <ConsultationCTA />
    </>
  );
}
