import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Logo } from "@/components/Logo";
import { useAuth } from "./auth";

export default function Login() {
  const { me, login } = useAuth(); const nav = useNavigate(); const loc = useLocation() as any;
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  if (me) return <Navigate to="/admin" replace />;
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); setErr(""); try { await login(email, password); nav(loc.state?.from || "/admin", { replace: true }); } catch (x: any) { setErr(x.message); } finally { setBusy(false); } };
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-5">
      <Helmet><meta name="robots" content="noindex,nofollow" /><title>Admin sign in | MetaWealth Capital</title></Helmet>
      <form onSubmit={submit} className="w-full max-w-sm border border-gold/30 bg-navy-2 p-8" aria-label="Admin sign in">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <h1 className="mb-6 text-center font-serif text-2xl !text-white">Administrator sign in</h1>
        <label className="label !text-white/70" htmlFor="ae">Email</label><input id="ae" type="email" autoComplete="username" required className="field mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="label !text-white/70" htmlFor="ap">Password</label><input id="ap" type="password" autoComplete="current-password" required className="field mb-5" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p role="alert" className="mb-4 text-sm text-red-300">{err}</p>}
        <button className="btn btn-gold w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}
