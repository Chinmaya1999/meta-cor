import { Globe2, UserCheck, Handshake } from "lucide-react";
import { CountUp, Reveal } from "@/components/Motion";

export function Trust() {
  return (
    <section id="trust" className="border-b border-navy/10 bg-ivory">
      <div className="container-x grid divide-y divide-navy/10 py-4 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        <Reveal className="px-2 py-9 sm:px-8"><p className="font-serif text-5xl text-navy"><CountUp to={60} suffix="+" /></p><p className="mt-3 text-sm font-medium text-ink">Years of combined advisory experience</p><p className="mt-1 text-xs text-muted">Collective experience of our advisory team</p></Reveal>
        <Reveal delay={0.1} className="px-2 py-9 sm:px-8"><Globe2 className="h-9 w-9 text-gold" strokeWidth={1.2} aria-hidden /><p className="mt-4 text-sm font-medium text-ink">Experience across India, UAE, UK and Singapore</p><p className="mt-1 text-xs text-muted">Combined team experience in four markets</p></Reveal>
        <Reveal delay={0.2} className="px-2 py-9 sm:px-8"><UserCheck className="h-9 w-9 text-gold" strokeWidth={1.2} aria-hidden /><p className="mt-4 text-sm font-medium text-ink">Personalised financial planning</p><p className="mt-1 text-xs text-muted">Built around you, not a template</p></Reveal>
        <Reveal delay={0.3} className="px-2 py-9 sm:px-8"><Handshake className="h-9 w-9 text-gold" strokeWidth={1.2} aria-hidden /><p className="mt-4 text-sm font-medium text-ink">Long-term client relationships</p><p className="mt-1 text-xs text-muted">Advice that evolves with your life</p></Reveal>
      </div>
    </section>
  );
}
