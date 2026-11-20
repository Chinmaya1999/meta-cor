import { PHOTOS, PhotoKey, VARIANT_PHOTO } from "@/photos";

export type ArtVariant = "skyline" | "towers" | "arches" | "waves" | "horizon" | "grid";

/** Renders an uploaded image when `src` is set, otherwise a licensed Dubai photograph (see /credits). */
export function ImageSlot({ src, alt, photo, variant = "skyline", className = "", priority = false, ratio, sizes = "100vw", position }: {
  src?: string; alt?: string; photo?: PhotoKey; variant?: ArtVariant; className?: string; priority?: boolean; ratio?: string; sizes?: string; position?: string;
}) {
  const style = { aspectRatio: ratio, objectPosition: position };
  if (src) return <img src={src} alt={alt ?? ""} loading={priority ? "eager" : "lazy"} decoding="async" className={`h-full w-full object-cover ${className}`} style={style} />;
  const p = PHOTOS[photo ?? VARIANT_PHOTO[variant]];
  return <img src={p.src} srcSet={p.srcSet} sizes={sizes} width={p.w} height={p.h} alt={alt === undefined ? p.alt : alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" className={`h-full w-full object-cover ${className}`} style={style} />;
}
