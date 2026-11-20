import { useState, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

export function Accordion({ items, dark = false }: { items: { q: string; a: string }[]; dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className={`divide-y ${dark ? "divide-white/10 border-y border-white/10" : "divide-navy/10 border-y border-navy/10"}`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <h3>
              <button
                className={`flex w-full items-center justify-between gap-6 py-5 text-left font-serif text-lg ${dark ? "text-white" : "text-navy"}`}
                aria-expanded={isOpen} aria-controls={`${base}-${i}`} id={`${base}-b${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {it.q}
                <Plus className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} aria-hidden />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`${base}-${i}`} role="region" aria-labelledby={`${base}-b${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <p className={`pb-6 pr-10 leading-relaxed ${dark ? "text-white/70" : "text-muted"}`}>{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
