import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Linkedin } from "@/components/Brand";
import { ImageSlot } from "@/components/ImageSlot";
import { Reveal, SectionHeading } from "@/components/Motion";
import { useFetch } from "@/hooks/useFetch";

export interface Member { _id: string; slug: string; name: string; title: string; photo?: string; qualifications: string[]; expertise: string[]; linkedin?: string; experience?: string; bio?: string }

export function TeamGrid({ members }: { members: Member[] }) {
  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m, i) => (
        <Reveal as="li" key={m._id} delay={(i % 3) * 0.08}>
          <article className="group">
            <Link to={`/team/${m.slug}`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden bg-navy">
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                  <ImageSlot src={m.photo} alt={`Portrait of ${m.name}`} variant="arches" className="grayscale-[35%] transition-[filter] duration-500 group-hover:grayscale-0" />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/80 to-transparent" />
                <span className="absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-gold/70" aria-hidden />
              </div>
              <h3 className="mt-5 font-serif text-4xl">{m.name}</h3>
              <p className="mt-1 text-sm text-gold-dark">{m.title}</p>
            </Link>
            {m.qualifications?.length > 0 && <p className="mt-2 text-xs text-muted">{m.qualifications.join(" · ")}</p>}
            {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn (opens in new tab)`} className="mt-3 inline-flex text-navy/60 hover:text-gold"><Linkedin className="h-4 w-4" /></a>}
          </article>
        </Reveal>
      ))}
    </ul>
  );
}

export function TeamEmpty() {
  return (
    <div className="border border-dashed border-navy/30 bg-ivory p-12 text-center">
      <Users className="mx-auto h-10 w-10 text-coral" strokeWidth={1.2} aria-hidden />
      <h3 className="mt-5 font-serif text-4xl">Our advisor profiles are being prepared</h3>
      <p className="mx-auto mt-3 max-w-lg text-muted">Our team brings over 60 years of combined advisory experience across India, the UAE, the UK and Singapore. Individual profiles will appear here shortly. In the meantime, we would be glad to introduce you to the team in person.</p>
      <Link to="/contact" className="btn btn-navy mt-8">Speak with our team</Link>
    </div>
  );
}

export function TeamSection() {
  const { data, loading } = useFetch<Member[]>("/team", []);
  const members = (data || []).slice(0, 3);
  return (
    <section className="section bg-sand">
      <div className="container-x">
        <SectionHeading eyebrow="06 / Our team and experts" title="Experience That Understands Your Financial Journey." intro="Our team includes certified financial planners, chartered financial analysts and certified public accountants." />
        <div className="mt-14">{loading ? null : members.length ? <TeamGrid members={members} /> : <TeamEmpty />}</div>
        {members.length > 0 && <div className="mt-12 text-center"><Link to="/team" className="btn btn-outline-dark">Meet the whole team</Link></div>}
      </div>
    </section>
  );
}
