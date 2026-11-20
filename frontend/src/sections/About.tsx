import { Link } from "react-router-dom";
import { ArrowUpRight, Asterisk } from "lucide-react";
import { CountUp, Reveal } from "@/components/Motion";

/** 01 / The big picture: intro plus verified trust figures. */
export function AboutSection() {
  return (
    <section id="big-picture" className="section">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-24">
          <Reveal><p className="eyebrow border-b border-navy/25 pb-5">01 / The big picture</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="h-section max-w-3xl">Your wealth deserves<br /><span className="accent">a thoughtful strategy.</span></h2>
            <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
              <div className="space-y-5 leading-[1.9] text-muted">
                <p>MetaWealth Capital is a wealth management and investment advisory firm based in Dubai, helping individuals, families and businesses achieve their financial goals.</p>
                <p>We offer personalised financial planning, investment advice, retirement and estate planning, tax strategy and risk management, with unbiased advice grounded in modern portfolio theory. Your circumstances, your family and your ambitions shape every recommendation.</p>
              </div>
              <div className="md:text-right"><Link to="/about" className="link-arrow text-navy">Discover our story <ArrowUpRight className="h-4 w-4" aria-hidden /></Link></div>
            </div>
          </Reveal>
        </div>

        <dl id="trust" className="mt-14 grid grid-cols-2 border-t border-navy/25 sm:mt-20 lg:grid-cols-4">
          <Reveal className="border-b border-navy/15 py-6 pr-4 lg:border-b-0 lg:pr-8"><dt className="font-serif text-5xl leading-none text-navy sm:text-6xl"><CountUp to={60} suffix="+" /></dt><dd className="mt-3 text-sm font-bold text-navy">Years of combined advisory experience</dd><dd className="mt-1 hidden text-xs text-muted sm:block">Collective experience of our advisory team</dd></Reveal>
          <Reveal delay={0.08} className="border-b border-l border-navy/15 py-6 pl-5 lg:border-b-0 lg:px-8"><dt className="font-serif text-5xl leading-none text-navy sm:text-6xl"><CountUp to={4} /></dt><dd className="mt-3 text-sm font-bold text-navy">Markets of team experience</dd><dd className="mt-1 text-xs text-muted">India · UAE · UK · Singapore</dd></Reveal>
          <Reveal delay={0.16} className="py-6 pr-4 lg:border-l lg:border-navy/15 lg:px-8"><dt className="flex h-[3.75rem] items-end sm:h-[4.5rem]"><Asterisk className="h-10 w-10 text-gold sm:h-12 sm:w-12" strokeWidth={1.6} aria-hidden /></dt><dd className="mt-3 text-sm font-bold text-navy">Personalised financial planning</dd><dd className="mt-1 hidden text-xs text-muted sm:block">Built around you, not a template</dd></Reveal>
          <Reveal delay={0.24} className="border-l border-navy/15 py-6 pl-5 lg:px-8"><dt className="flex h-[3.75rem] items-end sm:h-[4.5rem]"><Asterisk className="h-10 w-10 text-gold sm:h-12 sm:w-12" strokeWidth={1.6} aria-hidden /></dt><dd className="mt-3 text-sm font-bold text-navy">Long-term client relationships</dd><dd className="mt-1 hidden text-xs text-muted sm:block">Advice that evolves with your life</dd></Reveal>
        </dl>
      </div>
    </section>
  );
}
