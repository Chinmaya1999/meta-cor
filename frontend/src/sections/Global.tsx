import { useEffect, useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { motion, AnimatePresence } from "framer-motion";
import { MARKETS } from "@shared/content";
import { SectionHeading } from "@/components/Motion";

const W = 960, H = 480;
const PIN: Record<string, [number, number]> = { India: [78.9, 22], UAE: [54.3, 24.4], "United Kingdom": [-2, 54], Singapore: [103.8, 1.35] };
const HIGHLIGHT = new Set(["356", "784", "826"]); // India, UAE, UK ISO numeric

export function GlobalSection() {
  const [world, setWorld] = useState<any>(null);
  const [active, setActive] = useState("UAE");
  useEffect(() => { import("world-atlas/countries-110m.json").then((m: any) => setWorld(m.default ?? m)); }, []);
  const projection = useMemo(() => geoNaturalEarth1().fitSize([W, H], { type: "Sphere" } as any), []);
  const path = useMemo(() => geoPath(projection), [projection]);
  const countries = useMemo(() => (world ? (feature(world, world.objects.countries) as any).features : []), [world]);
  const current = MARKETS.find((m) => m.name === active)!;

  return (
    <section className="section overflow-hidden bg-navy-2">
      <div className="container-x">
        <SectionHeading light eyebrow="07 / Global perspective" title="Local Understanding. International Perspective." intro="Our advisers bring combined professional experience from four markets, helping clients whose lives and assets span borders." />
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.6fr_.8fr]">
          <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="World map highlighting India, the UAE, the United Kingdom and Singapore">
              <g>{countries.map((c: any, i: number) => <path key={c.id ?? `c${i}`} d={path(c) || ""} fill={HIGHLIGHT.has(String(c.id)) ? "rgba(199,167,108,.45)" : "rgba(255,255,255,.07)"} stroke="rgba(255,255,255,.14)" strokeWidth=".5" />)}</g>
              {MARKETS.filter((m) => m.name !== "UAE").map((m) => {
                const a = projection(PIN.UAE), b = projection(PIN[m.name]); if (!a || !b) return null;
                const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.hypot(a[0] - b[0], a[1] - b[1]) * 0.28;
                return <path key={`arc-${m.name}`} d={`M${a[0]} ${a[1]}Q${mx} ${my} ${b[0]} ${b[1]}`} fill="none" stroke="#FBD88E" strokeOpacity={m.name === active || active === "UAE" ? 0.85 : 0.35} strokeWidth="1.3" className="flight" />;
              })}
              {MARKETS.map((m) => {
                const p = projection(PIN[m.name]); if (!p) return null;
                const on = m.name === active;
                return (
                  <g key={m.name} transform={`translate(${p[0]},${p[1]})`} className="cursor-pointer" onClick={() => setActive(m.name)} onMouseEnter={() => setActive(m.name)}>
                    <circle r="7" fill="#F8BC4F" opacity=".35" className="origin-center animate-pulseRing" style={{ transformBox: "fill-box" }} />
                    <circle r={on ? 6 : 4.5} fill="#FBD88E" stroke="#29231D" strokeWidth="2" style={{ transition: "r .3s" }} />
                    <text className="max-sm:hidden" y="-14" textAnchor="middle" fontSize="12" fill={on ? "#FBD88E" : "rgba(255,255,255,.7)"} fontFamily="Inter, sans-serif" letterSpacing="1">{m.name}</text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Markets">
              {MARKETS.map((m) => (
                <button key={m.name} role="tab" aria-selected={m.name === active} onClick={() => setActive(m.name)} className={`min-h-[44px] border px-4 text-xs font-semibold uppercase tracking-widest transition-colors ${m.name === active ? "border-gold bg-gold text-navy" : "border-white/20 text-white/70 hover:border-gold"}`}>{m.name}</button>
              ))}
            </div>
          </div>
          <div className="min-h-[240px] border border-gold/30 bg-navy p-8">
            <AnimatePresence mode="wait">
              <motion.div key={current.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} role="tabpanel">
                <p className="eyebrow mb-3">Market experience</p>
                <h3 className="font-serif text-3xl !text-white">{current.name}</h3>
                <span className="gold-rule my-5" />
                <p className="leading-relaxed text-white/70">{current.text}</p>
              </motion.div>
            </AnimatePresence>
            <p className="mt-8 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-white/40">Markets shown reflect the combined professional experience of our team. They do not indicate offices or licensed operating territories.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
