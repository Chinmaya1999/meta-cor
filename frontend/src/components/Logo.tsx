/** Official MetaWealth Capital logo. `light` = placed on a dark background (uses the reversed artwork). */
export function Logo({ light = true, className = "", height = 40 }: { light?: boolean; className?: string; height?: number }) {
  const base = light ? "/brand/logo-light-v2" : "/brand/logo-v2";
  return (
    <picture className={`inline-block ${className}`}>
      <source srcSet={`${base}.webp`} type="image/webp" />
      <img src={`${base}.png`} alt="MetaWealth Capital" width={Math.round(height * 5.51)} height={height} style={{ height, width: "auto" }} decoding="async" />
    </picture>
  );
}
