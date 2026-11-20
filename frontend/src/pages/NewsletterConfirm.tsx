import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { api } from "@/services/api";

export default function NewsletterConfirm() {
  const [sp] = useSearchParams();
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  useEffect(() => { api.post<{ message: string }>("/newsletter/confirm", { token: sp.get("token") }).then((r) => setMsg({ ok: true, t: r.message })).catch((e) => setMsg({ ok: false, t: e.message })); }, [sp]);
  return (
    <section className="flex min-h-[80vh] items-center bg-navy pt-24"><Seo title="Confirm subscription" description="Confirm your newsletter subscription." noindex />
      <div className="container-x max-w-xl text-center" role="status"><h1 className="h-section !text-white">{msg ? (msg.ok ? "Subscription confirmed" : "Link not valid") : "Confirming…"}</h1><p className="mt-5 text-white/70">{msg?.t}</p><Link to="/" className="btn btn-gold mt-8">Back to home</Link></div>
    </section>
  );
}
