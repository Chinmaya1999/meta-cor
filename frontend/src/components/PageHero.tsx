import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ImageSlot, ArtVariant } from "./ImageSlot";
import { breadcrumbLd, Seo } from "./Seo";
import type { PhotoKey } from "@/photos";

export function PageHero({ eyebrow, title, intro, crumbs, variant = "towers", image, photo }: {
  eyebrow?: string; title: string; intro?: string; crumbs: { name: string; path: string }[]; variant?: ArtVariant; image?: string; photo?: PhotoKey;
}) {
  const all = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <section className="relative isolate overflow-hidden bg-navy pb-12 pt-32 sm:pb-24 sm:pt-44">
      <div className="absolute inset-0 -z-10"><ImageSlot src={image} photo={photo} alt="" variant={variant} priority /></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/25" />
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/70">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3 text-gold" aria-hidden />}
                {i === all.length - 1 ? <span aria-current="page" className="font-bold text-gold">{c.name}</span> : <Link to={c.path} className="inline-block py-2 hover:text-white">{c.name}</Link>}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="eyebrow on-dark mb-5 !text-white">{eyebrow}</p>}
        <h1 className="h-display max-w-4xl !text-white">{title}</h1>
        {intro && <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{intro}</p>}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(all)) }} />
    </section>
  );
}
export { Seo };
