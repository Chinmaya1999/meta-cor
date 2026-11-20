import { useState } from "react";
import { Link } from "react-router-dom";
import { RISK_DISCLOSURE } from "@shared/content";
import { PageHero, Seo } from "@/components/PageHero";
import { GrowthChart } from "@/components/GrowthChart";
import { goalProjection, retirementProjection, QUESTIONS, profileFor } from "@/lib/calc";
import { money } from "@/lib";

type Tab = "goal" | "retire" | "risk";
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));

function Num({ label, value, set, min = 0, max, step = 1, suffix, hint }: { label: string; value: number; set: (n: number) => void; min?: number; max: number; step?: number; suffix?: string; hint?: string }) {
  const id = label.replace(/\W/g, "");
  return (
    <div>
      <label htmlFor={id} className="label flex justify-between"><span>{label}</span><span className="text-gold-dark">{suffix === "%" || suffix === "yrs" ? `${value} ${suffix}` : money(value)}</span></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="w-full accent-[#F8BC4F]" />
      <input aria-label={`${label} (exact value)`} type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={(e) => set(clamp(Number(e.target.value), min, max))} className="field mt-2 !py-2" />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
const Stat = ({ k, v, big }: { k: string; v: string; big?: boolean }) => <div className="border-t border-navy/10 py-4"><p className="text-xs uppercase tracking-wider text-muted">{k}</p><p className={`font-serif ${big ? "text-4xl text-navy" : "text-2xl"}`}>{v}</p></div>;
const Note = ({ children }: { children: React.ReactNode }) => <p className="mt-6 border-l-2 border-gold bg-ivory p-4 text-xs leading-relaxed text-muted">{children}</p>;

function GoalCalc() {
  const [s, setS] = useState({ current: 50000, monthly: 1000, annualReturn: 6, years: 15 });
  const r = goalProjection(s);
  return (
    <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
      <div className="space-y-7 bg-white p-8 shadow-soft">
        <Num label="Current investment" value={s.current} set={(v) => setS({ ...s, current: v })} max={5_000_000} step={5000} />
        <Num label="Monthly contribution" value={s.monthly} set={(v) => setS({ ...s, monthly: v })} max={50_000} step={100} />
        <Num label="Assumed annual return" value={s.annualReturn} set={(v) => setS({ ...s, annualReturn: v })} max={15} step={0.5} suffix="%" hint="A hypothetical assumption, not a prediction." />
        <Num label="Investment duration" value={s.years} set={(v) => setS({ ...s, years: v })} min={1} max={40} suffix="yrs" />
      </div>
      <div>
        <div className="grid gap-x-8 sm:grid-cols-3"><Stat k="Total contributed" v={money(r.contributed)} /><Stat k="Estimated growth" v={money(r.growth)} /><Stat k="Illustrative final value" v={money(r.final)} big /></div>
        <div className="mt-4 bg-white p-5 shadow-soft"><GrowthChart points={r.points} label={`Illustrative growth over ${s.years} years ending at ${money(r.final)}`} /></div>
        <Note><strong>Hypothetical illustration only.</strong> Results depend entirely on the assumptions entered, assume a constant return and ignore fees, taxes and inflation. They are not guaranteed returns, a forecast or investment advice. {RISK_DISCLOSURE}</Note>
      </div>
    </div>
  );
}

function RetireCalc() {
  const [s, setS] = useState({ age: 35, retireAge: 60, savings: 80000, monthly: 1500, inflation: 3, annualReturn: 6, targetToday: 1_000_000 });
  const ok = s.retireAge > s.age;
  const r = retirementProjection(s);
  return (
    <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
      <div className="space-y-7 bg-white p-8 shadow-soft">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label" htmlFor="age">Current age</label><input id="age" type="number" min={18} max={80} className="field" value={s.age} onChange={(e) => setS({ ...s, age: clamp(Number(e.target.value), 18, 80) })} /></div>
          <div><label className="label" htmlFor="rage">Retirement age</label><input id="rage" type="number" min={30} max={85} className="field" value={s.retireAge} onChange={(e) => setS({ ...s, retireAge: clamp(Number(e.target.value), 30, 85) })} /></div>
        </div>
        {!ok && <p role="alert" className="text-sm text-red-600">Retirement age must be greater than your current age.</p>}
        <Num label="Current savings" value={s.savings} set={(v) => setS({ ...s, savings: v })} max={5_000_000} step={5000} />
        <Num label="Monthly savings" value={s.monthly} set={(v) => setS({ ...s, monthly: v })} max={50_000} step={100} />
        <Num label="Target corpus (today's money)" value={s.targetToday} set={(v) => setS({ ...s, targetToday: v })} max={20_000_000} step={50_000} hint="The amount you would like to have, in today's purchasing power." />
        <Num label="Estimated inflation" value={s.inflation} set={(v) => setS({ ...s, inflation: v })} max={10} step={0.5} suffix="%" />
        <Num label="Assumed investment return" value={s.annualReturn} set={(v) => setS({ ...s, annualReturn: v })} max={15} step={0.5} suffix="%" />
      </div>
      <div>
        {ok ? <>
          <div className="grid gap-x-8 sm:grid-cols-2"><Stat k={`Projected savings at ${s.retireAge}`} v={money(r.projected)} big /><Stat k="Inflation-adjusted goal" v={money(r.goalNominal)} big /><Stat k="Projected savings in today's money" v={money(r.projectedToday)} /><Stat k={r.gap > 0 ? "Illustrative shortfall" : "Illustrative surplus"} v={money(Math.abs(r.gap))} /></div>
          <p role="status" className={`mt-4 border p-4 text-sm ${r.onTrack ? "border-gold bg-gold/10" : "border-red-300 bg-red-50"}`}>{r.onTrack ? "On these assumptions, the projection meets the goal." : `On these assumptions, the projection falls short of the goal by ${money(r.gap)}. Increasing savings, extending the time horizon or revisiting the target may help.`}</p>
          <div className="mt-4 bg-white p-5 shadow-soft"><GrowthChart points={r.points} label={`Illustrative savings growth to age ${s.retireAge}`} /></div></> : null}
        <Note><strong>Assumptions and limitations.</strong> Assumes constant return and inflation, monthly contributions that do not increase, and no fees, taxes, or withdrawals before retirement. It does not model pensions, property, longevity or currency changes. Illustration only; not personal advice. {RISK_DISCLOSURE}</Note>
      </div>
    </div>
  );
}

function RiskQuiz() {
  const [a, setA] = useState<(number | null)[]>(QUESTIONS.map(() => null));
  const [shown, setShown] = useState(false);
  const complete = a.every((x) => x !== null);
  const res = complete ? profileFor(a as number[]) : null;
  return (
    <div className="mx-auto max-w-3xl">
      <ol className="space-y-8">{QUESTIONS.map((q, i) => (
        <li key={q.id}><fieldset><legend className="font-serif text-xl"><span className="mr-2 text-gold">{i + 1}.</span>{q.q}</legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">{q.options.map((o) => <label key={o.label} className={`flex min-h-[52px] cursor-pointer items-center gap-3 border p-3 text-sm transition-colors ${a[i] === o.score ? "border-gold bg-white shadow-soft" : "border-navy/15 hover:border-gold/60"}`}><input type="radio" name={q.id} checked={a[i] === o.score} onChange={() => { const n = [...a]; n[i] = o.score; setA(n); setShown(false); }} className="accent-[#F8BC4F]" />{o.label}</label>)}</div></fieldset></li>))}</ol>
      <button className="btn btn-navy mt-10" disabled={!complete} onClick={() => setShown(true)}>See indicative result</button>
      {!complete && <p className="mt-2 text-xs text-muted">Answer all questions to see your result.</p>}
      {shown && res && (
        <div role="status" className="mt-10 border border-gold bg-white p-8 shadow-lift">
          <p className="eyebrow mb-2">Indicative, educational result</p><h3 className="font-serif text-4xl">{res.name}</h3><p className="mt-3 text-muted">{res.text}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted">This questionnaire is a general educational tool. It is <strong>not</strong> a personalised investment recommendation or a suitability assessment, and it does not consider your full financial circumstances. Please speak with an adviser before making investment decisions.</p>
          <Link to="/book" className="btn btn-gold mt-6">Discuss with an adviser</Link>
        </div>)}
    </div>
  );
}

export default function Tools() {
  const [tab, setTab] = useState<Tab>("goal");
  const tabs: [Tab, string][] = [["goal", "Financial goal"], ["retire", "Retirement"], ["risk", "Risk profile"]];
  return (
    <>
      <Seo title="Financial Planning Tools" description="Illustrative financial goal and retirement calculators and an educational risk profile questionnaire from MetaWealth Capital." />
      <PageHero eyebrow="Planning tools" title="Explore Your Financial Future." intro="Illustrative tools to help you think about your goals. They are not advice." crumbs={[{ name: "Planning Tools", path: "/tools" }]} variant="grid" />
      <section className="section"><div className="container-x">
        <div role="tablist" aria-label="Planning tools" className="mb-10 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} aria-controls="tool-panel" onClick={() => setTab(k)} className={`min-h-[52px] border px-2 text-[13px] font-bold leading-tight transition-colors sm:px-6 sm:text-sm ${tab === k ? "border-navy bg-navy text-white" : "border-navy/20 hover:border-gold"}`}>{l}</button>)}</div>
        <div id="tool-panel" role="tabpanel">{tab === "goal" ? <GoalCalc /> : tab === "retire" ? <RetireCalc /> : <RiskQuiz />}</div>
      </div></section>
    </>
  );
}
