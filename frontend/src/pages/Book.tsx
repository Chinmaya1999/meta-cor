import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { CONSULTATION_TYPES } from "@shared/content";
import { PageHero, Seo } from "@/components/PageHero";
import { api, ApiError } from "@/services/api";
import { countryList } from "@/lib";

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export default function Book() {
  const [type, setType] = useState(CONSULTATION_TYPES[0]);
  const [dates, setDates] = useState<Set<string>>(new Set());
  const [meta, setMeta] = useState({ timezone: "", slotMinutes: 60 });
  const [loadErr, setLoadErr] = useState(false);
  const [date, setDate] = useState(""); const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const now = new Date(); const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", country: "", message: "", consent: false });
  const [hp, setHp] = useState(""); const [started] = useState(() => Date.now());
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false); const [done, setDone] = useState(""); const [formErr, setFormErr] = useState("");
  const countries = useMemo(countryList, []);

  const loadDates = () => api.get<{ dates: string[]; timezone: string; slotMinutes: number }>("/bookings/dates").then((r) => { setDates(new Set(r.dates)); setMeta(r); setLoadErr(false); }).catch(() => setLoadErr(true));
  useEffect(() => { loadDates(); }, []);
  useEffect(() => { if (!date) return; setSlots(null); setTime(""); api.get<{ slots: string[] }>(`/bookings/slots?date=${date}`).then((r) => setSlots(r.slots)).catch(() => setSlots([])); }, [date]);

  const first = new Date(cursor.y, cursor.m, 1); const offset = (first.getDay() + 6) % 7; const days = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const label = first.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const shift = (n: number) => setCursor((c) => { const d = new Date(c.y, c.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setFormErr(""); const er: Record<string, string> = {};
    if (!date || !time) er.slot = "Please choose a date and time.";
    if (form.fullName.trim().length < 2) er.fullName = "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email address";
    if (!/^[+\d][\d\s()-]{6,}$/.test(form.phone)) er.phone = "Enter a valid phone number";
    if (!form.consent) er.consent = "Consent is required";
    setErrs(er); if (Object.keys(er).length) return;
    setBusy(true);
    try { const r = await api.post<{ message: string }>("/bookings", { type, date, time, ...form, website: hp, formStartedAt: started }); setDone(r.message); }
    catch (err) {
      if (err instanceof ApiError) { setFormErr(err.message); setErrs(err.fields || {}); if (err.code === "SLOT_TAKEN") { setTime(""); api.get<{ slots: string[] }>(`/bookings/slots?date=${date}`).then((r) => setSlots(r.slots)); } }
      else setFormErr("Something went wrong. Please try again or call us.");
    } finally { setBusy(false); }
  }

  const E = ({ k }: { k: string }) => errs[k] ? <p role="alert" className="mt-1 text-xs text-red-600">{errs[k]}</p> : null;
  if (done) return (<><Seo title="Booking request received" description="Your consultation request has been received." noindex /><section className="flex min-h-[80vh] items-center bg-ivory pt-28"><div className="container-x max-w-xl text-center" role="status"><CheckCircle2 className="mx-auto h-14 w-14 text-gold" aria-hidden /><h1 className="mt-6 font-serif text-4xl">Request received</h1><p className="mt-4 text-muted">{done}</p><p className="mt-2 text-sm text-muted">A confirmation message has been sent to your email address. This is a request until our team confirms it.</p></div></section></>);

  return (
    <>
      <Seo title="Schedule a Consultation" description="Request a consultation with MetaWealth Capital. Choose a consultation type and a time that suits you." />
      <PageHero eyebrow="Consultation" title="Schedule a Consultation." intro="Choose a topic and time. Only times that are currently open are shown." crumbs={[{ name: "Schedule a Consultation", path: "/book" }]} variant="horizon" />
      <section className="section"><form onSubmit={submit} noValidate className="container-x grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div className="space-y-10">
          <fieldset><legend className="font-serif text-2xl">1. Consultation type</legend><div className="mt-4 grid gap-3 sm:grid-cols-2">{CONSULTATION_TYPES.map((t) => <label key={t} className={`flex min-h-[56px] cursor-pointer items-center gap-3 border p-4 text-sm transition-colors ${type === t ? "border-gold bg-white shadow-soft" : "border-navy/15 hover:border-gold/60"}`}><input type="radio" name="type" checked={type === t} onChange={() => setType(t)} className="accent-[#F8BC4F]" />{t}</label>)}</div></fieldset>
          <div><h2 className="font-serif text-2xl">2. Choose a date</h2>
            {loadErr ? <p className="mt-4 text-sm text-red-600">We could not load availability. <button type="button" className="underline" onClick={loadDates}>Try again</button> or <a className="underline" href="/contact">contact us</a>.</p> : (
              <div className="mt-4 max-w-md border border-navy/10 bg-white p-5">
                <div className="mb-4 flex items-center justify-between"><button type="button" aria-label="Previous month" onClick={() => shift(-1)} className="p-2 hover:text-gold"><ChevronLeft className="h-5 w-5" /></button><p className="font-serif text-lg" aria-live="polite">{label}</p><button type="button" aria-label="Next month" onClick={() => shift(1)} className="p-2 hover:text-gold"><ChevronRight className="h-5 w-5" /></button></div>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase text-muted">{["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => <span key={d} className="py-1">{d}</span>)}</div>
                <div className="grid grid-cols-7 gap-1">{Array.from({ length: offset }).map((_, i) => <span key={`e${i}`} />)}{Array.from({ length: days }).map((_, i) => { const d = iso(cursor.y, cursor.m, i + 1); const ok = dates.has(d); return <button type="button" key={d} disabled={!ok} aria-pressed={date === d} aria-label={`${i + 1} ${label}${ok ? "" : ", unavailable"}`} onClick={() => setDate(d)} className={`aspect-square text-sm transition-colors ${date === d ? "bg-navy text-white" : ok ? "hover:bg-gold/30" : "cursor-not-allowed text-navy/25"}`}>{i + 1}</button>; })}</div>
                {meta.timezone && <p className="mt-4 text-xs text-muted">Times shown in {meta.timezone}</p>}
              </div>)}</div>
          <div><h2 className="font-serif text-2xl">3. Choose a time</h2><div className="mt-4 min-h-[56px]" aria-live="polite">
            {!date ? <p className="text-sm text-muted">Select a date to see available times.</p> : slots === null ? <p className="flex items-center gap-2 text-sm text-muted"><Loader2 className="h-4 w-4 animate-spin" aria-hidden />Checking availability…</p> : slots.length === 0 ? <p className="text-sm text-muted">No times are available on this date. Please choose another.</p> : <div className="flex flex-wrap gap-2">{slots.map((s) => <button type="button" key={s} aria-pressed={time === s} onClick={() => setTime(s)} className={`min-h-[44px] min-w-[84px] border px-4 text-sm transition-colors ${time === s ? "border-navy bg-navy text-white" : "border-navy/20 bg-white hover:border-gold"}`}>{s}</button>)}</div>}
            <E k="slot" /></div></div>
        </div>
        <div className="space-y-5 self-start bg-white p-6 shadow-soft sm:p-9"><h2 className="font-serif text-2xl">4. Your details</h2>
          {date && time && <p className="border-l-2 border-gold bg-ivory p-3 text-sm">{type}<br /><strong>{new Date(date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} at {time}</strong></p>}
          <div><label className="label" htmlFor="b-name">Full name *</label><input id="b-name" className="field" autoComplete="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /><E k="fullName" /></div>
          <div><label className="label" htmlFor="b-email">Email *</label><input id="b-email" type="email" className="field" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><E k="email" /></div>
          <div><label className="label" htmlFor="b-phone">Phone *</label><input id="b-phone" type="tel" className="field" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><E k="phone" /></div>
          <div><label className="label" htmlFor="b-country">Country</label><select id="b-country" className="field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}><option value="">Select…</option>{countries.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label" htmlFor="b-msg">Anything we should know?</label><textarea id="b-msg" rows={3} className="field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
          <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          <p className="text-xs text-muted">Please do not include sensitive financial credentials.</p>
          <label className="flex items-start gap-3 text-sm text-muted"><input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-0.5 h-5 w-5 shrink-0 accent-[#F8BC4F]" /><span>I consent to MetaWealth Capital using my details to arrange this consultation, per the <a href="/legal/privacy" className="underline">Privacy Policy</a>. *</span></label><E k="consent" />
          {formErr && <p role="alert" className="text-sm text-red-600">{formErr}</p>}
          <button className="btn btn-navy w-full" disabled={busy}>{busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden />Submitting…</> : "Request consultation"}</button>
        </div>
      </form></section>
    </>
  );
}
