import { Link } from "react-router-dom";
import { Eye, Target, Gem } from "lucide-react";
import { PageHero, Seo } from "@/components/PageHero";
import { ImageSlot } from "@/components/ImageSlot";
import { Reveal, SectionHeading } from "@/components/Motion";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { GlobalSection } from "@/sections/Global";
import { TeamSection } from "@/sections/Team";
import { WHY } from "@shared/content";

const pillars = [
  { icon: Target, t: "Mission", d: "To deliver unbiased wealth advisory and investment consultancy that helps individuals, families and businesses build, preserve and manage their wealth." },
  { icon: Eye, t: "Vision", d: "To be a trusted, long-term financial partner to the families and business owners we serve, known for clarity, care and consistency." },
  { icon: Gem, t: "Values", d: "Transparency in how we advise. Personalisation in every plan. A long-term perspective in every decision. Putting the client's objectives first." },
];

export default function About() {
  return (
    <>
      <Seo title="About Us" description="Learn about MetaWealth Capital, a Dubai-based wealth management and investment advisory firm with over 60 years of combined team experience across India, the UAE, the UK and Singapore." />
      <PageHero eyebrow="About us" title="Advice Built on Understanding People, Not Products." intro="A Dubai-based wealth management and investment advisory firm serving individuals, families and businesses." crumbs={[{ name: "About Us", path: "/about" }]} variant="arches" />
      <section className="section"><div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <Reveal><p className="eyebrow mb-4">Who we are</p><h2 className="h-section">A Wealth Management Firm Dedicated to Your Financial Goals.</h2><span className="gold-rule mt-6" />
          <div className="prose-mw mt-8">
            <p>MetaWealth Capital helps individuals and families achieve their financial goals through personalised financial planning, investment management and tax strategy. We also advise businesses on how to invest to meet their objectives.</p>
            <p>Our team brings combined experience of over 60 years across markets in India, the UAE, the UK and Singapore, and includes certified financial planners, chartered financial analysts and certified public accountants.</p>
            <p>Our investment approach is based on modern portfolio theory, and we stay informed about developments in the financial industry so that our advice remains relevant to your circumstances.</p>
          </div></Reveal>
        <Reveal delay={0.1}><div className="aspect-[5/4] overflow-hidden shadow-lift"><ImageSlot alt="Dubai skyline" variant="skyline" /></div></Reveal>
      </div></section>
      <section className="bg-white section"><div className="container-x">
        <div className="grid gap-px bg-navy/10 md:grid-cols-3">{pillars.map((p, i) => (
          <Reveal key={p.t} delay={i * 0.1} className="bg-white p-10"><p.icon className="h-10 w-10 text-gold" strokeWidth={1.2} aria-hidden /><h3 className="mt-6 font-serif text-2xl">{p.t}</h3><p className="mt-3 leading-relaxed text-muted">{p.d}</p></Reveal>))}</div>
      </div></section>
      <section className="section"><div className="container-x">
        <SectionHeading eyebrow="Advisory philosophy" title="How We Think About Your Wealth." />
        <div className="mt-14 grid gap-x-16 gap-y-10 md:grid-cols-2">{WHY.map((w, i) => (<Reveal key={w.title} delay={(i % 2) * 0.1} className="flex gap-6 border-t border-navy/10 pt-6"><span className="font-serif text-3xl text-gold">{String(i + 1).padStart(2, "0")}</span><div><h3 className="font-serif text-xl">{w.title}</h3><p className="mt-2 text-muted">{w.text}</p></div></Reveal>))}</div>
      </div></section>
      <GlobalSection /><TeamSection />
      <section className="section"><div className="container-x text-center"><Link to="/approach" className="btn btn-outline-dark">See how we work</Link></div></section>
      <ConsultationCTA />
    </>
  );
}
