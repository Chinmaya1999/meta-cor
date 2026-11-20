import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Asterisk, Clock } from "lucide-react";
import { PHOTOS } from "@/photos";

const fade = (d: number) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] as const } });
const LINES: [string, boolean][] = [["Build Wealth", false], ["With Purpose.", false], ["Preserve It With", true], ["Confidence.", true]];

function DubaiClock() {
  const [t, setT] = useState("");
  useEffect(() => { const f = () => setT(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit" }).format(new Date())); f(); const i = setInterval(f, 20000); return () => clearInterval(i); }, []);
  return <span className="tabular-nums">{t}</span>;
}

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], reduce ? [0, 0] : [0, 120]);
  const p = PHOTOS["hero-sunset"];
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-navy pb-12 pt-[104px] sm:pb-20 sm:pt-[140px]">
      <motion.div style={{ y }} className="absolute inset-0 -z-20 scale-110">
        <img src={p.src} srcSet={p.srcSet} sizes="100vw" width={p.w} height={p.h} alt={p.alt} fetchPriority="high" decoding="async" className="h-full w-full object-cover object-[60%_center] brightness-[1.35] contrast-[1.05] saturate-[1.15]" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/80 via-navy/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-navy/70 to-transparent" />

      <div className="container-x w-full">
        <motion.p {...fade(0.1)} className="eyebrow on-dark mb-7 flex flex-wrap items-center gap-4 !text-white">Your partner in wealth <Asterisk className="h-5 w-5 text-gold" aria-hidden />
          <span className="inline-flex items-center gap-1.5 border border-white/30 px-2.5 py-1 text-[10px] tracking-[.16em] text-white/80"><Clock className="h-3 w-3 text-gold" aria-hidden />DUBAI <DubaiClock /> GST</span></motion.p>
        <h1 className="h-display !text-white" aria-label="Build Wealth With Purpose. Preserve It With Confidence.">
          {LINES.map(([l, amber], i) => (
            <span key={l} className="block overflow-hidden pb-[0.04em]" aria-hidden>
              <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.95, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }} className={`block ${amber ? "!text-gold" : ""}`}>{l}</motion.span>
            </span>
          ))}
        </h1>
        <div className="mt-9 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <motion.p {...fade(0.9)} className="max-w-md text-base leading-relaxed text-white/90 sm:text-lg">Personalised wealth management and financial advisory designed around your ambitions, your family and your financial future.</motion.p>
            <motion.div {...fade(1.05)} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <Link to="/book" className="btn btn-gold">Schedule a Consultation <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
              <Link to="/services" className="link-arrow text-white">Explore Our Services <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
            </motion.div>
          </div>
          <motion.a {...fade(1.3)} href="#big-picture" className="group hidden items-center gap-4 text-white lg:flex" aria-label="Scroll to content">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/70 transition-colors group-hover:bg-white group-hover:text-navy"><ArrowDown className="h-5 w-5" /></span>
            <span><span className="block font-bold">See how we work</span><span className="block text-[10px] font-bold uppercase tracking-[.2em] text-white/70">Scroll to explore</span></span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
