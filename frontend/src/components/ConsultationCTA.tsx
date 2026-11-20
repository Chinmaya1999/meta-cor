import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Motion";

export function ConsultationCTA({ title = "Your Financial Future Starts With a Conversation.", text = "Every financial journey is different. Let's understand your ambitions and explore how a personalised financial strategy can support your goals." }: { title?: string; text?: string }) {
  const m = title.match(/^(.+?[.?!])\s+(.+)$/);
  const parts = m ? [m[1], m[2]] : title.match(/^(.*?)(\s\S+\s\S+\.?)$/)?.slice(1) ?? [title, ""];
  return (
    <section className="section bg-gold">
      <Reveal className="container-x grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-20">
        <div>
          <p className="eyebrow mb-8 !text-navy">Begin the conversation</p>
          <h2 className="font-serif text-[2.8rem] font-medium leading-[.98] text-navy sm:text-6xl lg:text-[4.4rem]">{parts[0]} <span className="text-white">{parts[1]}</span></h2>
        </div>
        <div>
          <p className="leading-relaxed text-navy/85">{text}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/book" className="btn btn-navy">Schedule a Consultation <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
            <Link to="/contact" className="btn btn-outline-dark">Contact Our Team</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
