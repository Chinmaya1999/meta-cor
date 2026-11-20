import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AREAS_OF_INTEREST } from "@shared/content";
import { api, ApiError } from "@/services/api";
import { countryList } from "@/lib";

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{6,}$/, "Enter a valid phone number"),
  country: z.string().min(2, "Select your country"),
  areaOfInterest: z.string().min(1, "Select an area of interest"),
  preferredDate: z.string().optional(),
  message: z.string().trim().min(10, "Please tell us a little more (10+ characters)"),
  consent: z.literal(true, { message: "Consent is required to proceed" }),
});
type FormData = z.infer<typeof schema>;

export function ContactForm({ defaultInterest = "", tone = "paper" }: { defaultInterest?: string; tone?: "paper" | "amber" }) {
  const countries = useMemo(countryList, []);
  const [started] = useState(() => Date.now());
  const [hp, setHp] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [serverErr, setServerErr] = useState<string | null>(null);
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { areaOfInterest: defaultInterest } });
  const today = new Date().toISOString().slice(0, 10);

  const onSubmit = async (v: FormData) => {
    setServerErr(null);
    try {
      const r = await api.post<{ message: string }>("/enquiries", { ...v, preferredDate: v.preferredDate || "", website: hp, formStartedAt: started });
      setDone(r.message); reset();
    } catch (e) {
      if (e instanceof ApiError) { Object.entries(e.fields || {}).forEach(([k, m]) => setError(k as keyof FormData, { message: m })); setServerErr(e.message); }
      else setServerErr("We could not send your enquiry. Please try again or call us.");
    }
  };

  if (done) return (
    <div role="status" className="border border-gold/40 bg-white p-10 text-center shadow-soft">
      <CheckCircle2 className="mx-auto h-12 w-12 text-gold" aria-hidden />
      <h3 className="mt-5 font-serif text-2xl">Thank you</h3>
      <p className="mt-3 text-muted">{done}</p>
      <button className="btn btn-outline-dark mt-8" onClick={() => setDone(null)}>Send another message</button>
    </div>
  );

  const Err = ({ n }: { n: keyof FormData }) => errors[n] ? <p id={`${n}-err`} role="alert" className={`mt-1 text-xs font-bold ${tone === "amber" ? "text-red-900" : "text-red-600"}`}>{errors[n]?.message as string}</p> : null;
  const ia = (n: keyof FormData) => ({ "aria-invalid": !!errors[n], "aria-describedby": errors[n] ? `${n}-err` : undefined });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={`space-y-5 ${tone === "amber" ? "form-amber" : "bg-white p-6 shadow-soft sm:p-10"}`} aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="label" htmlFor="fullName">Full name *</label><input id="fullName" autoComplete="name" className={`field ${errors.fullName ? "field-error" : ""}`} {...ia("fullName")} {...register("fullName")} /><Err n="fullName" /></div>
        <div><label className="label" htmlFor="email">Email address *</label><input id="email" type="email" autoComplete="email" className={`field ${errors.email ? "field-error" : ""}`} {...ia("email")} {...register("email")} /><Err n="email" /></div>
        <div><label className="label" htmlFor="phone">Phone number *</label><input id="phone" type="tel" autoComplete="tel" className={`field ${errors.phone ? "field-error" : ""}`} {...ia("phone")} {...register("phone")} /><Err n="phone" /></div>
        <div><label className="label" htmlFor="country">Country *</label>
          <select id="country" autoComplete="country-name" className={`field ${errors.country ? "field-error" : ""}`} {...ia("country")} {...register("country")}><option value="">Select…</option>{countries.map((c) => <option key={c}>{c}</option>)}</select><Err n="country" /></div>
        <div><label className="label" htmlFor="areaOfInterest">Area of interest *</label>
          <select id="areaOfInterest" className={`field ${errors.areaOfInterest ? "field-error" : ""}`} {...ia("areaOfInterest")} {...register("areaOfInterest")}><option value="">Select…</option>{AREAS_OF_INTEREST.map((c) => <option key={c}>{c}</option>)}</select><Err n="areaOfInterest" /></div>
        <div><label className="label" htmlFor="preferredDate">Preferred consultation date</label><input id="preferredDate" type="date" min={today} className="field" {...register("preferredDate")} /></div>
      </div>
      <div><label className="label" htmlFor="message">Message *</label><textarea id="message" rows={5} className={`field ${errors.message ? "field-error" : ""}`} {...ia("message")} {...register("message")} /><Err n="message" /></div>
      <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className={`border-l-2 border-navy p-4 text-xs leading-relaxed ${tone === "amber" ? "bg-navy/10 text-navy" : "bg-ivory text-muted"}`}>For your security, please do not include passwords, account numbers, card details or other sensitive financial credentials in this form.</div>
      <div>
        <label className={`flex items-start gap-3 text-sm ${tone === "amber" ? "text-navy" : "text-muted"}`}><input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#29231D]" {...register("consent")} aria-invalid={!!errors.consent} />
          <span>I consent to MetaWealth Capital processing my details to respond to this enquiry, as described in the <a href="/legal/privacy" className="text-navy underline">Privacy Policy</a>. *</span></label>
        <Err n="consent" />
      </div>
      {serverErr && <p role="alert" className="text-sm font-bold text-red-800">{serverErr}</p>}
      <button type="submit" className="btn btn-navy w-full sm:w-auto" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…</> : "Send enquiry"}</button>
    </form>
  );
}
