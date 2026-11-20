import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SERVICES } from "@shared/content";
import { ImageSlot } from "@/components/ImageSlot";
import { Reveal, SectionHeading } from "@/components/Motion";
import { useFetch } from "@/hooks/useFetch";
import { SERVICE_PHOTO } from "@/photos";

type Svc = { slug: string; title: string; icon: string; summary: string; image?: string };
const OFFSET = ["md:mt-0", "md:mt-14", "md:mt-28"];

export function useServices() {
  const { data } = useFetch<Svc[]>("/services", SERVICES);
  return data?.length ? data : (SERVICES as Svc[]);
}

/** 02 / Our services: staggered photo cards. */
export function ServicesSection() {
  const services = useServices().slice(0, 6);
  return (
    <section className="section bg-sand">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="02 / Our services" title="Comprehensive Financial Guidance. One Trusted Relationship." />
          <Reveal><p className="max-w-xs text-sm leading-relaxed text-muted lg:text-right">Six disciplines, one coordinated plan, advised from Dubai.</p></Reveal>
        </div>
        <ul className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-14 md:overflow-visible md:px-0 md:pb-24">
          {services.map((s, i) => (
            <li key={s.slug} className={`w-[80%] shrink-0 snap-start sm:w-[52%] md:w-auto ${OFFSET[i % 3]}`}>
              <Link to={`/services/${s.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                  <div className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-105"><ImageSlot src={s.image} photo={SERVICE_PHOTO[s.slug]} alt="" sizes="(min-width:768px) 33vw, 100vw" /></div>
                  <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-navy transition-transform duration-300 group-hover:scale-110"><ArrowUpRight className="h-5 w-5" aria-hidden /></span>
                </div>
                <div className="mt-5 flex items-center justify-between text-[11px] font-bold uppercase tracking-[.14em] text-muted"><span>{String(i + 1).padStart(2, "0")} / Service</span><span>Dubai, UAE</span></div>
                <h3 className="mt-3 flex items-start justify-between gap-4 font-serif text-[2.1rem] leading-[1] text-navy">{s.title}<ArrowUpRight className="mt-1.5 h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.summary}</p>
                <span className="mt-4 inline-block border-b border-navy pb-1 text-xs font-bold text-navy">Explore service</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-muted md:hidden">Swipe to explore <ArrowRight className="h-3.5 w-3.5" aria-hidden /></p>
        <p className="mt-4 text-xs text-muted">Photography of Dubai, UAE. <Link to="/credits" className="inline-block py-2 underline">Photo credits</Link>.</p>
      </div>
    </section>
  );
}

/** Editorial index used on the Services page. */
export function ServicesIndex() {
  const services = useServices();
  return (
    <section className="section">
      <div className="container-x">
        <ul className="border-t border-navy/25">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={Math.min(i, 4) * 0.05} className="border-b border-navy/25">
              <Link to={`/services/${s.slug}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 py-8 transition-colors hover:bg-sand/60 md:grid-cols-[60px_1.1fr_1.3fr_180px_52px] md:px-4 md:py-8">
                <span className="text-xs font-bold text-coral">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="font-serif text-4xl leading-none transition-colors group-hover:text-coral md:text-5xl">{s.title}</h2>
                <span className="order-last col-span-3 text-sm leading-relaxed text-muted md:order-none md:col-span-1">{s.summary}</span>
                <span className="relative hidden aspect-[3/2] w-[180px] overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block"><ImageSlot src={s.image} photo={SERVICE_PHOTO[s.slug]} alt="" sizes="180px" /></span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-navy/40 transition-colors group-hover:bg-navy group-hover:text-ivory"><ArrowUpRight className="h-5 w-5" aria-hidden /></span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
