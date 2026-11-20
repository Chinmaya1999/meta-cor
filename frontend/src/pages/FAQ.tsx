import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SERVICES } from "@shared/content";
import { PageHero, Seo } from "@/components/PageHero";
import { Accordion } from "@/components/Accordion";
import { ConsultationCTA } from "@/components/ConsultationCTA";

const GENERAL = [
  { q: "What does MetaWealth Capital do?", a: "We provide wealth management and investment advisory to individuals, families and businesses, including financial, retirement, tax and estate planning." },
  { q: "How do I get started?", a: "Schedule a consultation or send an enquiry. We begin with a conversation about your goals and circumstances." },
  { q: "Where are you based?", a: "Our published location is Dubai, UAE. Our team also has professional experience in India, the UK and Singapore." },
  { q: "Can you guarantee returns?", a: "No. Nobody can. All investments carry risk, including the loss of capital. Illustrations on this website are hypothetical." },
  { q: "Is it safe to send you my financial details by email or through the website?", a: "Please do not send passwords, account credentials or card details through our website or by email." },
];
export default function FAQ() {
  const [q, setQ] = useState("");
  const all = useMemo(() => [...GENERAL, ...SERVICES.flatMap((s) => s.faqs)], []);
  const items = all.filter((i) => (i.q + i.a).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <Seo title="Frequently Asked Questions" description="Answers to common questions about MetaWealth Capital's wealth management, financial planning and investment advisory services." jsonLd={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: GENERAL.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <PageHero eyebrow="FAQ" title="Your Questions, Answered." crumbs={[{ name: "FAQ", path: "/faq" }]} variant="waves" />
      <section className="section"><div className="container-x max-w-3xl">
        <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden /><label htmlFor="faqq" className="sr-only">Search FAQs</label><input id="faqq" type="search" className="field !pl-10" placeholder="Search questions" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="mt-10" aria-live="polite">{items.length ? <Accordion key={q} items={items} /> : <p className="text-center text-muted">No questions match "{q}".</p>}</div>
      </div></section>
      <ConsultationCTA />
    </>
  );
}
