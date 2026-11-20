import { PageHero, Seo } from "@/components/PageHero";
import { PHOTO_CREDITS } from "@/photos";
import { ImageSlot } from "@/components/ImageSlot";

export default function Credits() {
  return (
    <>
      <Seo title="Photo credits" description="Credits and licences for the photography of Dubai used on this website." />
      <PageHero eyebrow="Credits" title="Photo credits." intro="Photographs of Dubai, UAE, used under free licences. Thank you to the photographers." crumbs={[{ name: "Photo credits", path: "/credits" }]} photo="burj-al-arab" />
      <section className="section"><div className="container-x"><ul className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {PHOTO_CREDITS.map((c) => (
          <li key={c.key}><div className="aspect-[3/2] overflow-hidden bg-navy"><ImageSlot photo={c.key} alt="" sizes="(min-width:1024px) 30vw, 100vw" /></div>
            <p className="mt-4 font-serif text-2xl leading-tight">{c.title.replace(/\.[a-z]+$/i, "")}</p>
            <p className="mt-1 text-sm text-muted">{c.author}</p>
            <p className="mt-1 text-xs"><a className="underline" href={c.licenseUrl || c.source} target="_blank" rel="noopener noreferrer">{c.license}</a> · <a className="underline" href={c.source} target="_blank" rel="noopener noreferrer">Source (Wikimedia Commons)</a></p></li>))}
      </ul></div></section>
    </>
  );
}
