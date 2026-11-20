import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const ORIGIN = (import.meta.env.VITE_SITE_URL as string) || "https://www.metawealthcapital.com";
const NAME = "MetaWealth Capital";

export function Seo({ title, description, image, type = "website", jsonLd, noindex }: {
  title?: string; description: string; image?: string; type?: string; jsonLd?: object | object[]; noindex?: boolean;
}) {
  const { pathname } = useLocation();
  const full = title ? `${title} | ${NAME}` : `${NAME} | Wealth Management & Investment Advisory`;
  const url = ORIGIN + (pathname === "/" ? "" : pathname);
  const img = image ? (image.startsWith("http") ? image : ORIGIN + image) : `${ORIGIN}/og-default.png`;
  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:site_name" content={NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: ORIGIN + it.path })),
});
