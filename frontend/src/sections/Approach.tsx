import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Asterisk, Plus } from "lucide-react";
import { APPROACH } from "@shared/content";
import { Reveal } from "@/components/Motion";

/** Five steps as a numbered dark accordion. */
export function ApproachTimeline({ detail = false }: { dark?: boolean; detail?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ol className="border-t border-white/20">
      {APPROACH.map((s, i) => {
        const isOpen = open === i;
        return (
          <li key={s.n} className="border-b border-white/20">
            <h3>
              <button className="flex w-full items-center gap-5 py-6 text-left" aria-expanded={isOpen} aria-controls={`step-${i}`} id={`step-b${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                <span className="w-6 text-xs font-bold text-gold">{s.n}</span>
                <span className="flex-1 font-serif text-4xl leading-none text-white sm:text-[2.6rem]">{s.title}</span>
                <Plus className={`h-6 w-6 shrink-0 text-white transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} aria-hidden />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`step-${i}`} role="region" aria-labelledby={`step-b${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <p className="max-w-xl pb-7 pl-11 leading-relaxed text-white/70">{s.text}{detail && <span className="mt-3 block text-[11px] font-bold uppercase tracking-[.2em] text-gold">Step {i + 1} of 5</span>}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}

/** 03 / How we work. */
export function ApproachSection() {
  return (
    <section className="section on-dark bg-navy">
      <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <p className="eyebrow mb-8">03 / How we work</p>
          <h2 className="h-section !text-white">A clear strategy<br /><span className="accent">for every financial journey.</span></h2>
          <p className="mt-8 max-w-sm leading-relaxed text-white/70">Five deliberate steps, from understanding your position to reviewing your progress, so that every recommendation has a reason.</p>
          <Link to="/approach" className="link-arrow mt-8 text-white">See the full approach <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
          <Asterisk className="mt-16 hidden h-24 w-24 text-gold lg:block" strokeWidth={1.2} aria-hidden />
        </Reveal>
        <Reveal delay={0.1}><ApproachTimeline /></Reveal>
      </div>
    </section>
  );
}
