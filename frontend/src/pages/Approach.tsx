import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHero, Seo } from "@/components/PageHero";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { ApproachTimeline } from "@/sections/Approach";
import { APPROACH } from "@shared/content";

const DETAIL: Record<string, { what: string[]; you: string; outcome: string }> = {
  Discover: { what: ["A relaxed, in-depth conversation about your family, work and ambitions", "A review of current assets, income, liabilities and protection", "Clarity on what success looks like to you"], you: "Share your goals and current financial documents.", outcome: "A shared, accurate picture of where you are and where you want to be." },
  Analyse: { what: ["Assessment of assets, liabilities and cash flow", "Evaluation of risk tolerance, capacity and investment preferences", "Identification of gaps, concentrations and opportunities"], you: "Complete a risk questionnaire and confirm your priorities.", outcome: "A clear view of strengths, gaps and the trade-offs involved." },
  Strategise: { what: ["A personalised financial and investment strategy", "Tax, protection, retirement and estate considerations in one plan", "Plain-language recommendations with the reasoning behind them"], you: "Review the proposal and challenge anything that does not feel right.", outcome: "A written strategy you understand and are comfortable with." },
  Implement: { what: ["Coordination of the agreed recommendations", "Working with your other professionals where needed", "Clear timelines and responsibilities"], you: "Approve and authorise the steps you choose to take.", outcome: "Your strategy put into action, with progress you can follow." },
  Review: { what: ["Regular reviews of progress against your goals", "Adjustments when markets, laws or your circumstances change", "Open communication throughout"], you: "Tell us when something important changes in your life.", outcome: "A plan that stays relevant as your life evolves." },
};

export default function Approach() {
  const [i, setI] = useState(0);
  const step = APPROACH[i], d = DETAIL[step.title];
  return (
    <>
      <Seo title="Our Approach" description="Discover, Analyse, Strategise, Implement, Review: MetaWealth Capital's five-step approach to personalised wealth management and financial planning." />
      <PageHero eyebrow="Our approach" title="A Clear Strategy for Every Financial Journey." intro="Five deliberate steps from understanding your position to reviewing your progress." crumbs={[{ name: "Our Approach", path: "/approach" }]} variant="waves" />
      <section className="bg-navy pb-24 pt-4"><div className="container-x"><ApproachTimeline detail /></div></section>
      <section className="section"><div className="container-x">
        <p className="eyebrow mb-4">Explore each step</p>
        <div role="tablist" aria-label="Advisory process steps" className="flex flex-wrap gap-2">{APPROACH.map((s, k) => <button key={s.n} role="tab" id={`tab-${k}`} aria-selected={k === i} aria-controls="step-panel" onClick={() => setI(k)} className={`min-h-[48px] border px-6 font-serif text-lg transition-colors ${k === i ? "border-navy bg-navy text-white" : "border-navy/20 text-navy hover:border-gold"}`}><span className="mr-2 text-sm text-gold">{s.n}</span>{s.title}</button>)}</div>
        <AnimatePresence mode="wait"><motion.div key={i} id="step-panel" role="tabpanel" aria-labelledby={`tab-${i}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-10 grid gap-10 border border-navy/10 bg-white p-8 sm:p-12 lg:grid-cols-[1.2fr_.8fr]">
          <div><h2 className="font-serif text-4xl">{step.n}. {step.title}</h2><p className="lead mt-4">{step.text}</p><ul className="mt-8 space-y-4">{d.what.map((w) => <li key={w} className="flex gap-4 text-ink/85"><span className="mt-2.5 h-px w-5 shrink-0 bg-gold" />{w}</li>)}</ul></div>
          <div className="space-y-6 bg-ivory p-8"><div><p className="eyebrow mb-2">What we ask of you</p><p className="text-ink/85">{d.you}</p></div><div><p className="eyebrow mb-2">What you receive</p><p className="text-ink/85">{d.outcome}</p></div></div>
        </motion.div></AnimatePresence>
      </div></section>
      <ConsultationCTA />
    </>
  );
}
