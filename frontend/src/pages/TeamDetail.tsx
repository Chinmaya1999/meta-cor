import { Link, useParams } from "react-router-dom";
import { Linkedin } from "@/components/Brand";
import { PageHero, Seo } from "@/components/PageHero";
import { ImageSlot } from "@/components/ImageSlot";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { useFetch } from "@/hooks/useFetch";
import { Member } from "@/sections/Team";
import NotFound from "./NotFound";

export default function TeamDetail() {
  const { slug = "" } = useParams();
  const { data: m, loading, error } = useFetch<Member>(`/team/${slug}`);
  if (loading) return <div className="min-h-screen bg-navy" />;
  if (error || !m) return <NotFound />;
  return (
    <>
      <Seo title={`${m.name}, ${m.title}`} description={(m.bio || `${m.name} is ${m.title} at MetaWealth Capital.`).slice(0, 160)} type="profile" image={m.photo} />
      <PageHero eyebrow={m.title} title={m.name} crumbs={[{ name: "Our Team", path: "/team" }, { name: m.name, path: `/team/${m.slug}` }]} variant="arches" />
      <section className="section"><div className="container-x grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
        <div><div className="aspect-[4/5] overflow-hidden"><ImageSlot src={m.photo} alt={`Portrait of ${m.name}`} variant="arches" /></div>
          {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark mt-6 w-full"><Linkedin className="h-4 w-4" aria-hidden />LinkedIn profile</a>}</div>
        <div className="prose-mw">
          {m.bio && <p className="text-lg">{m.bio}</p>}
          {m.experience && <><h2>Professional experience</h2><p>{m.experience}</p></>}
          {m.qualifications?.length > 0 && <><h2>Qualifications</h2><ul className="list-disc space-y-2 pl-5">{m.qualifications.map((q) => <li key={q}>{q}</li>)}</ul></>}
          {m.expertise?.length > 0 && <><h2>Areas of expertise</h2><ul className="flex flex-wrap gap-2">{m.expertise.map((q) => <li key={q} className="border border-gold/50 px-3 py-1 text-sm">{q}</li>)}</ul></>}
          <p className="mt-10"><Link to="/team" className="text-sm underline underline-offset-4">← Back to the team</Link></p>
        </div>
      </div></section>
      <ConsultationCTA />
    </>
  );
}
