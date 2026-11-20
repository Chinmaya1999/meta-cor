import { Seo } from "@/components/Seo";
import { Hero } from "@/sections/Hero";
import { AboutSection } from "@/sections/About";
import { ServicesSection } from "@/sections/Services";
import { ApproachSection } from "@/sections/Approach";
import { WhySection } from "@/sections/Why";
import { GrowthTeaser } from "@/sections/GrowthTeaser";
import { TeamSection } from "@/sections/Team";
import { GlobalSection } from "@/sections/Global";
import { InsightsSection } from "@/sections/Insights";
import { Commitments } from "@/sections/Commitments";
import { ContactSection } from "@/sections/ContactSection";
import { useSite } from "@/hooks/useSite";

export default function Home() {
  const site = useSite();
  return (
    <>
      <Seo description="MetaWealth Capital is a Dubai-based wealth management and investment advisory firm offering personalised financial planning, retirement, tax and estate planning." jsonLd={{
        "@context": "https://schema.org", "@type": "FinancialService", name: "MetaWealth Capital", url: "https://www.metawealthcapital.com", telephone: site.phone,
        areaServed: "Dubai, UAE", address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE", ...(site.address ? { streetAddress: site.address } : {}) },
        description: "Investment advisory and wealth management for individuals, families and businesses.",
      }} />
      <Hero /><AboutSection /><ServicesSection /><ApproachSection /><WhySection /><GrowthTeaser /><TeamSection /><GlobalSection /><InsightsSection /><Commitments /><ContactSection />
    </>
  );
}
