import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { Linkedin, Instagram, XIcon as Twitter } from "./Brand";
import { SERVICES, RISK_DISCLOSURE } from "@shared/content";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { useSite } from "@/hooks/useSite";

export function Footer() {
  const site = useSite();
  const socials = [["linkedin", Linkedin, "LinkedIn"], ["instagram", Instagram, "Instagram"], ["x", Twitter, "X"]] as const;
  return (
    <footer className="bg-navy text-white/70">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-2 md:gap-12 md:py-16 lg:grid-cols-[1.4fr_.8fr_1fr_1.2fr]">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">{site.tagline}. Unbiased wealth advisory and investment consultancy for high-net-worth individuals, families and businesses.</p>
          <div className="mt-6 flex gap-3">
            {socials.map(([k, I, label]) => site.social[k] ? (
              <a key={k} href={site.social[k]} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in new tab)`} className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold"><I className="h-4 w-4" /></a>
            ) : null)}
          </div>
        </div>
        <nav aria-label="Company">
          <h2 className="eyebrow mb-5 !font-sans">Company</h2>
          <ul className="space-y-0 text-sm md:space-y-1">
            {[["/about", "About Us"], ["/approach", "Our Approach"], ["/team", "Our Team"], ["/insights", "Insights"], ["/tools", "Planning Tools"], ["/faq", "FAQ"], ["/contact", "Contact Us"]].map(([to, l]) => <li key={to}><Link to={to} className="inline-block py-3 transition-colors hover:text-gold md:py-1.5">{l}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="Services">
          <h2 className="eyebrow mb-5 !font-sans">Services</h2>
          <ul className="space-y-0 text-sm md:space-y-1">{SERVICES.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`} className="inline-block py-3 transition-colors hover:text-gold md:py-1.5">{s.title}</Link></li>)}</ul>
        </nav>
        <div className="col-span-2 md:col-span-1">
          <h2 className="eyebrow mb-5 !font-sans">Contact</h2>
          <ul className="space-y-0 text-sm md:space-y-1">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />{site.address || site.location}</li>
            <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden /><a href={site.phoneHref} className="inline-block py-2.5 hover:text-gold md:py-0">{site.phone}</a></li>
            {site.email && <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden /><a href={`mailto:${site.email}`} className="break-all hover:text-gold">{site.email}</a></li>}
          </ul>
          <div className="mt-6"><p className="mb-3 text-xs uppercase tracking-widest text-white/50">Insights by email</p><div className="relative"><NewsletterForm /></div></div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x pb-28 pt-8 text-xs leading-relaxed text-white/50 lg:pb-8">
          <p className="max-w-5xl">{site.regulatoryStatement || RISK_DISCLOSURE}</p>
          <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row">
            <p>© {new Date().getFullYear()} MetaWealth Capital. All rights reserved.</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-0">
              {[["/legal/privacy", "Privacy Policy"], ["/legal/terms", "Terms of Use"], ["/legal/cookies", "Cookie Policy"], ["/legal/risk-disclosure", "Risk Disclosure"], ["/legal/regulatory", "Regulatory Information"], ["/credits", "Photo credits"]].map(([to, l]) => <li key={to}><Link to={to} className="inline-block py-3 hover:text-gold md:py-2">{l}</Link></li>)}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
