import { motion, useInView, useReducedMotion, useMotionValue, animate } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

export function Reveal({ children, delay = 0, y = 28, className = "", as = "div" }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" | "article" }) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M className={className} initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </M>
  );
}

export function CountUp({ to, suffix = "", prefix = "", duration = 1.8 }: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) { if (reduce) setVal(to); return; }
    const c = animate(mv, to, { duration, ease: "easeOut", onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, duration, reduce, mv]);
  return <span ref={ref} aria-label={`${prefix}${to.toLocaleString()}${suffix}`}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/** Numbered label + big condensed heading; the second sentence is set in the accent colour. */
export function SectionHeading({ eyebrow, title, intro, align = "left", light = false }: { eyebrow?: string; title: string; intro?: string; align?: "left" | "center"; light?: boolean }) {
  const m = title.match(/^(.+?[.?!])\s+(.+)$/);
  const first = m ? m[1] : title, second = m ? m[2] : "";
  return (
    <Reveal className={`max-w-4xl ${align === "center" ? "mx-auto text-center" : ""} ${light ? "on-dark" : ""}`}>
      {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
      <h2 className={`h-section ${light ? "!text-white" : ""}`}>{first}{second && <><br /><span className="accent">{second}</span></>}</h2>
      {intro && <p className={`lead mt-7 max-w-2xl ${align === "center" ? "mx-auto" : ""} ${light ? "!text-white/70" : ""}`}>{intro}</p>}
    </Reveal>
  );
}
