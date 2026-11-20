import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import { PageHero, Seo } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { OfficeCard } from "@/sections/ContactSection";
import { Reveal } from "@/components/Motion";
import { useSearchParams } from "react-router-dom";

export default function Contact() {
  const [sp] = useSearchParams();
  return (
    <>
      <Seo title="Contact Us" description="Contact MetaWealth Capital in Dubai, UAE to discuss wealth management, financial planning and investment advisory, or schedule a consultation." />
      <PageHero eyebrow="Contact us" title="Let's Talk About Your Goals." intro="Tell us a little about your situation and we will respond to arrange a conversation." crumbs={[{ name: "Contact Us", path: "/contact" }]} variant="horizon" />
      <section className="section"><div className="container-x grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
        <Reveal><OfficeCard />
          <div className="mt-10 border border-gold/40 bg-white p-7"><CalendarCheck className="h-8 w-8 text-gold" strokeWidth={1.3} aria-hidden /><h2 className="mt-4 font-serif text-2xl">Prefer to book a time?</h2><p className="mt-2 text-sm text-muted">Choose a consultation type and a time that suits you.</p><Link to="/book" className="btn btn-navy mt-5">Book a consultation</Link></div></Reveal>
        <Reveal delay={0.1}><ContactForm defaultInterest={sp.get("interest") || ""} /></Reveal>
      </div></section>
    </>
  );
}
