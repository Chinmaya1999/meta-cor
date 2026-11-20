import { WHY } from "@shared/content";
import { ImageSlot } from "@/components/ImageSlot";
import { Reveal, SectionHeading } from "@/components/Motion";

/** 04 / Why MetaWealth Capital: photo with caption bar plus six principles. */
export function WhySection() {
  return (
    <section className="section">
      <div className="container-x grid items-start gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
        <Reveal>
          <div className="aspect-[4/3] overflow-hidden bg-navy lg:aspect-[5/6]"><ImageSlot photo="blue-hour" alt="Dubai skyline and the Burj Khalifa reflected in calm water at blue hour" sizes="(min-width:1024px) 40vw, 100vw" /></div>
          <div className="flex justify-between gap-4 bg-gold px-5 py-4 text-[11px] font-bold uppercase tracking-[.14em] text-navy"><span>Advising from Dubai</span><span>A long-term partnership</span></div>
        </Reveal>
        <div>
          <SectionHeading eyebrow="04 / Why MetaWealth Capital" title="More Than Financial Advice. A Long-Term Partnership." />
          <dl className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={(i % 2) * 0.08} className="border-t border-navy/25 pt-5">
                <dt className="flex items-baseline gap-3"><span className="text-xs font-bold text-coral">{String(i + 1).padStart(2, "0")}</span><span className="font-serif text-[1.9rem] leading-none text-navy">{w.title}</span></dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">{w.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
