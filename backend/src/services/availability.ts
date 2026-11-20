import { Booking, Setting } from "../models/index.js";

export interface Availability { days: number[]; start: string; end: string; slotMinutes: number; leadDays: number; horizonDays: number; blockedDates: string[]; timezone: string }
export const DEFAULT_AVAILABILITY: Availability = { days: [1, 2, 3, 4, 5], start: "10:00", end: "17:00", slotMinutes: 60, leadDays: 1, horizonDays: 45, blockedDates: [], timezone: "Asia/Dubai (GST, UTC+4)" };

export async function getAvailabilityConfig(): Promise<Availability> {
  const s = await Setting.findOne({ key: "availability" }).lean();
  return { ...DEFAULT_AVAILABILITY, ...((s?.value as object) || {}) };
}
const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const dow = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();
const todayDubai = () => new Date(Date.now() + 4 * 3600_000).toISOString().slice(0, 10);
const addDays = (d: string, n: number) => new Date(new Date(`${d}T00:00:00Z`).getTime() + n * 86400000).toISOString().slice(0, 10);

export function isBookableDate(cfg: Availability, date: string) {
  const t = todayDubai();
  return date >= addDays(t, cfg.leadDays) && date <= addDays(t, cfg.horizonDays) && cfg.days.includes(dow(date)) && !cfg.blockedDates.includes(date);
}

/** Slots are only returned after checking the working-hours config AND existing active bookings. */
export async function slotsFor(date: string) {
  const cfg = await getAvailabilityConfig();
  if (!isBookableDate(cfg, date)) return { cfg, slots: [] as string[] };
  const taken = new Set((await Booking.find({ date, status: { $in: ["pending", "confirmed"] } }).select("time").lean()).map((b) => b.time));
  const slots: string[] = [];
  for (let m = toMin(cfg.start); m + cfg.slotMinutes <= toMin(cfg.end); m += cfg.slotMinutes) if (!taken.has(fmt(m))) slots.push(fmt(m));
  return { cfg, slots };
}
export async function bookableDates() {
  const cfg = await getAvailabilityConfig();
  const t = todayDubai(); const out: string[] = [];
  for (let i = cfg.leadDays; i <= cfg.horizonDays; i++) { const d = addDays(t, i); if (isBookableDate(cfg, d)) out.push(d); }
  return { cfg, dates: out };
}
