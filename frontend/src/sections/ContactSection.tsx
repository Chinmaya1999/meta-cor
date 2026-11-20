import { Link } from "react-router-dom";
import { ArrowUpRight, Phone, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Motion";
import { useSite } from "@/hooks/useSite";

export function OfficeCard({ tone = "paper" }: { tone?: "paper" | "amber" }) {
  const site = useSite();
  const mapQ = site.address ? encodeURIComponent(`${site.address}`) : "";
  const ic = tone === "amber" ? "text-navy" : "text-coral";
  return (
    <div className="space-y-6">
      <ul className="space-y-5 text-navy">
        <li className="flex gap-4"><MapPin className={`mt-1 h-5 w-5 shrink-0 ${ic}`} aria-hidden /><div><p className="label !mb-0.5">Office</p><p>{site.address || site.location}</p></div></li>
        <li className="flex gap-4"><Phone className={`mt-1 h-5 w-5 shrink-0 ${ic}`} aria-hidden /><div><p className="label !mb-0.5">Telephone</p><a href={site.phoneHref} className="inline-block py-2 underline-offset-4 hover:underline">{site.phone}</a></div></li>
        {site.email && <li className="flex gap-4"><Mail className={`mt-1 h-5 w-5 shrink-0 ${ic}`} aria-hidden /><div><p className="label !mb-0.5">Email</p><a href={`mailto:${site.email}`} className="break-all underline-offset-4 hover:underline">{site.email}</a></div></li>}
        <li className="flex gap-4"><Clock className={`mt-1 h-5 w-5 shrink-0 ${ic}`} aria-hidden /><div><p className="label !mb-0.5">Consultations</p><p>By appointment, Dubai time (GST)</p></div></li>
      </ul>
      {mapQ ? <iframe title="MetaWealth Capital office location" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full border-0" src={`https://www.google.com/maps?q=${mapQ}&output=embed`} /> : null}
    </div>
  );
}

/** 10 / Contact: full amber band. */
export function ContactSection() {
  return (
    <section id="contact" className="section bg-gold">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <Reveal>
          <p className="eyebrow mb-8 !text-navy">10 / Your next big thing</p>
          <h2 className="font-serif text-[3rem] font-medium leading-[.98] text-navy sm:text-6xl lg:text-[4.6rem]">Let&rsquo;s talk about <span className="text-white">your goals.</span></h2>
          <p className="mt-8 max-w-sm leading-relaxed text-navy/80">Every financial journey is different. Share a few details and a member of our team will respond to arrange a conversation.</p>
          <div className="mt-8 border-t border-navy/30 pt-8"><OfficeCard tone="amber" /></div>
          <Link to="/book" className="link-arrow mt-8 text-navy">Or book a consultation time <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
        </Reveal>
        <Reveal delay={0.1}><p className="mb-6 font-bold text-navy">Start with a few details.</p><ContactForm tone="amber" /></Reveal>
      </div>
    </section>
  );
}
