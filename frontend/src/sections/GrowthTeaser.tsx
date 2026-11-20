import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { goalProjection } from "@/lib/calc";
import { CountUp, Reveal } from "@/components/Motion";
import { RISK_DISCLOSURE } from "@shared/content";

const INPUT = { current: 50000, monthly: 1000, annualReturn: 6, years: 15 };

export function GrowthTeaser() {
  const reduce = useReducedMotion();
  const r = goalProjection(INPUT);
  const W = 640, H = 300, P = 24, max = r.final;
  const x = (y: number) => P + (y / INPUT.years) * (W - P * 2), y = (v: number) => H - P - (v / max) * (H - P * 2);
  const val = r.points.map((p, i) => `${i ? "L" : "M"}${x(p.year).toFixed(1)} ${y(p.value).toFixed(1)}`).join("");
  const con = r.points.map((p, i) => `${i ? "L" : "M"}${x(p.year).toFixed(1)} ${y(p.contributed).toFixed(1)}`).join("");
  return (
    <section className="section bg-sand">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
        <Reveal>
          <p className="eyebrow mb-6">05 / Plan ahead</p>
          <h2 className="h-section">See how time can<br /><span className="accent">work for your wealth.</span></h2>
          <p className="lead mt-7">Explore how regular investing and long-term thinking might compound. Adjust the assumptions yourself in our planning tools.</p>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-navy/25 pt-6">
            <div><dt className="text-[11px] font-bold uppercase tracking-widest text-muted">Starting</dt><dd className="mt-1 font-serif text-3xl text-navy">$50,000</dd></div>
            <div><dt className="text-[11px] font-bold uppercase tracking-widest text-muted">Monthly</dt><dd className="mt-1 font-serif text-3xl text-navy">$1,000</dd></div>
            <div><dt className="text-[11px] font-bold uppercase tracking-widest text-muted">Assumed p.a.</dt><dd className="mt-1 font-serif text-3xl text-navy">6% · 15 yrs</dd></div>
          </dl>
          <Link to="/tools" className="btn btn-navy mt-9">Try the planning tools</Link>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="bg-navy p-6 sm:p-8">
            <p className="text-xs uppercase tracking-widest text-white/50">Illustrative value after 15 years</p>
            <p className="mt-1 font-serif text-6xl text-gold"><CountUp prefix="$" to={Math.round(r.final)} duration={2.4} /></p>
            <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Illustrative compound growth chart">
              <defs><linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F8BC4F" stopOpacity=".45" /><stop offset="1" stopColor="#F8BC4F" stopOpacity="0" /></linearGradient></defs>
              {[0.25, 0.5, 0.75].map((t) => <line key={t} x1={P} x2={W - P} y1={y(max * t)} y2={y(max * t)} stroke="#fff" strokeOpacity=".08" />)}
              <motion.path d={`${val}L${x(15)} ${H - P}L${x(0)} ${H - P}Z`} fill="url(#gt)" initial={{ opacity: reduce ? 1 : 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.8 }} />
              <motion.path d={con} fill="none" stroke="#fff" strokeOpacity=".5" strokeDasharray="5 5" strokeWidth="1.5" initial={{ pathLength: reduce ? 1 : 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: "easeInOut" }} />
              <motion.path d={val} fill="none" stroke="#FBD88E" strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.4, ease: "easeInOut" }} />
              <motion.circle cx={x(15)} cy={y(r.final)} r="6" fill="#FFF4D6" initial={{ scale: reduce ? 1 : 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 2.4, type: "spring" }} />
            </svg>
            <div className="flex gap-6 text-xs text-white/60"><span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-gold-light" />Illustrative value</span><span className="flex items-center gap-2"><i className="h-0.5 w-5 border-t border-dashed border-white/60" />Contributions</span></div>
            <p className="mt-5 text-[11px] leading-relaxed text-white/40">Hypothetical illustration, not a forecast. {RISK_DISCLOSURE}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
