import { money } from "@/lib";

export function GrowthChart({ points, label }: { points: { year: number; contributed: number; value: number }[]; label: string }) {
  const W = 640, H = 280, P = { l: 56, r: 12, t: 12, b: 28 };
  const max = Math.max(...points.map((p) => p.value), 1);
  const x = (y: number) => P.l + (y / Math.max(points[points.length - 1].year, 1)) * (W - P.l - P.r);
  const y = (v: number) => H - P.b - (v / max) * (H - P.t - P.b);
  const line = (k: "value" | "contributed") => points.map((p, i) => `${i ? "L" : "M"}${x(p.year).toFixed(1)} ${y(p[k]).toFixed(1)}`).join("");
  const area = `${line("value")}L${x(points[points.length - 1].year)} ${H - P.b}L${x(0)} ${H - P.b}Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={label}>
        <defs><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F8BC4F" stopOpacity=".35" /><stop offset="1" stopColor="#F8BC4F" stopOpacity="0" /></linearGradient></defs>
        {ticks.map((t) => <g key={t}><line x1={P.l} x2={W - P.r} y1={y(max * t)} y2={y(max * t)} stroke="#29231D" strokeOpacity=".08" /><text x={P.l - 8} y={y(max * t) + 4} textAnchor="end" fontSize="10" fill="#75808D">{money(max * t).replace(/,000,000$/, "M")}</text></g>)}
        <path d={area} fill="url(#gc)" /><path d={line("value")} fill="none" stroke="#F8BC4F" strokeWidth="2.5" /><path d={line("contributed")} fill="none" stroke="#29231D" strokeWidth="1.5" strokeDasharray="5 4" />
        {points.filter((_, i) => i % Math.ceil(points.length / 6) === 0).map((p) => <text key={p.year} x={x(p.year)} y={H - 8} textAnchor="middle" fontSize="10" fill="#75808D">Yr {p.year}</text>)}
      </svg>
      <figcaption className="mt-2 flex gap-6 text-xs text-muted"><span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-gold" />Illustrative value</span><span className="flex items-center gap-2"><i className="h-0.5 w-5 border-t border-dashed border-navy" />Total contributed</span></figcaption>
    </figure>
  );
}
