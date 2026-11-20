import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Motion";

// Our own principles, not client testimonials.
const ITEMS = [
  { q: "Unbiased advice, built around your goals, your family and your time horizon.", tag: "Advisory" },
  { q: "A plan is a living document. We review it and adjust it as your life changes.", tag: "Planning" },
  { q: "Plain-language explanations and open communication at every step.", tag: "Communication" },
];

/** 09 / Our commitments slider. */
export function Commitments() {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((v) => (v + d + ITEMS.length) % ITEMS.length);
  return (
    <section className="section border-t border-navy/20">
      <div className="container-x grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-24">
        <Reveal><p className="eyebrow">09 / Our commitments</p><span aria-hidden className="mt-6 block font-serif text-8xl leading-[.6] text-coral sm:mt-8 sm:text-9xl">&ldquo;</span></Reveal>
        <Reveal delay={0.1}>
          <div aria-live="polite" className="min-h-[200px]"><p className="font-serif text-[2rem] leading-[1.14] text-navy sm:text-4xl lg:text-[3rem]">&ldquo;{ITEMS[i].q}&rdquo;</p></div>
          <p className="mt-6 border-t border-navy/20 pt-5 text-[11px] font-bold uppercase tracking-[.16em] text-muted">{ITEMS[i].tag} &middot; Our principle</p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs font-bold tracking-[.16em]">{String(i + 1).padStart(2, "0")} / {String(ITEMS.length).padStart(2, "0")}</span>
            <span className="flex gap-3"><button aria-label="Previous commitment" onClick={() => go(-1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-navy/40 hover:bg-navy hover:text-ivory"><ArrowLeft className="h-5 w-5" /></button><button aria-label="Next commitment" onClick={() => go(1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-navy/40 hover:bg-navy hover:text-ivory"><ArrowRight className="h-5 w-5" /></button></span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
