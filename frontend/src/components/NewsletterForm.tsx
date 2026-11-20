import { useState } from "react";
import { api, ApiError } from "@/services/api";

export function NewsletterForm({ dark = true }: { dark?: boolean }) {
  const [email, setEmail] = useState(""); const [consent, setConsent] = useState(false); const [hp, setHp] = useState("");
  const [state, setState] = useState<{ s: "idle" | "busy" | "ok" | "err"; m?: string }>({ s: "idle" });
  const [started] = useState(() => Date.now());
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return setState({ s: "err", m: "Please tick the consent box." });
    setState({ s: "busy" });
    try { const r = await api.post<{ message: string }>("/newsletter", { email, consent, website: hp, formStartedAt: started }); setState({ s: "ok", m: r.message || "Thank you." }); setEmail(""); setConsent(false); }
    catch (err) { setState({ s: "err", m: err instanceof ApiError ? (err.fields?.email || err.message) : "Something went wrong." }); }
  }
  const t = dark ? "text-white/70" : "text-muted";
  return (
    <form onSubmit={submit} noValidate aria-label="Newsletter subscription">
      <div className="flex">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input id="nl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="field !border-r-0" autoComplete="email" />
        <button className="btn btn-gold !px-5 !text-[11px]" disabled={state.s === "busy"}>{state.s === "busy" ? "…" : "Subscribe"}</button>
      </div>
      <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <label className={`mt-3 flex items-start gap-2 text-xs ${t}`}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#F8BC4F]" />
        I agree to receive MetaWealth Capital insights and accept the Privacy Policy. Unsubscribe any time.
      </label>
      <p role="status" aria-live="polite" className={`mt-2 text-xs ${state.s === "err" ? "text-red-400" : "text-gold"}`}>{state.m}</p>
    </form>
  );
}
