import { PageHero, Seo } from "@/components/PageHero";
import { ServicesIndex } from "@/sections/Services";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { SectionHeading } from "@/components/Motion";
import { Accordion } from "@/components/Accordion";

const faqs = [
  { q: "Who do you advise?", a: "We advise high-net-worth individuals, families and businesses, including professionals and business owners planning for their financial future." },
  { q: "Do I need to be an existing investor?", a: "No. Many clients begin with financial planning before making any investment decisions." },
  { q: "Are your services available in every country?", a: "Our availability depends on applicable regulation. We will confirm what we can offer you during your initial consultation." },
];
export default function Services() {
  return (
    <>
      <Seo title="Wealth Management & Financial Advisory Services" description="Financial planning, investment advisory, wealth management, retirement, tax strategy, estate planning and risk management from MetaWealth Capital in Dubai." />
      <PageHero eyebrow="Our services" title="Comprehensive Financial Guidance. One Trusted Relationship." crumbs={[{ name: "Services", path: "/services" }]} variant="towers" />
      <ServicesIndex />
      <section className="section"><div className="container-x grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><SectionHeading eyebrow="Questions" title="Before You Begin" /><Accordion items={faqs} /></div></section>
      <ConsultationCTA />
    </>
  );
}
