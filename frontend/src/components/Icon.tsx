import * as L from "lucide-react";
import type { LucideProps } from "lucide-react";

const map: Record<string, React.ComponentType<LucideProps>> = {
  Compass: L.Compass, LineChart: L.LineChart, Landmark: L.Landmark, Sunset: L.Sunset,
  Scale: L.Scale, TreePine: L.TreePine, ShieldCheck: L.ShieldCheck,
};
export function Icon({ name, ...p }: { name: string } & LucideProps) {
  const C = map[name] || L.Compass;
  return <C strokeWidth={1.4} aria-hidden {...p} />;
}
