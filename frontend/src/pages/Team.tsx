import { PageHero, Seo } from "@/components/PageHero";
import { TeamGrid, TeamEmpty, Member } from "@/sections/Team";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { useFetch } from "@/hooks/useFetch";

export default function Team() {
  const { data, loading } = useFetch<Member[]>("/team", []);
  return (
    <>
      <Seo title="Our Team" description="Meet the advisers at MetaWealth Capital, with over 60 years of combined experience across India, the UAE, the UK and Singapore." />
      <PageHero eyebrow="Our team" title="Experience That Understands Your Financial Journey." intro="Certified financial planners, chartered financial analysts and certified public accountants working together for your goals." crumbs={[{ name: "Our Team", path: "/team" }]} variant="arches" />
      <section className="section"><div className="container-x">{loading ? null : data?.length ? <TeamGrid members={data} /> : <TeamEmpty />}</div></section>
      <ConsultationCTA />
    </>
  );
}
