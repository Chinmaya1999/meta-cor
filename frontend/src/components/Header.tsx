import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { SERVICES } from "@shared/content";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services", mega: true },
  { to: "/approach", label: "Our Approach" },
  { to: "/team", label: "Our Team" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact Us" },
];

export function Header() {
  const [mega, setMega] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const { pathname } = useLocation();
  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number>(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMega(false); setDrawer(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMega(false); setDrawer(false); } };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    if (drawer) drawerRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [drawer]);
  useEffect(() => {
    if (!mega) return;
    const click = (e: MouseEvent) => { if (!megaRef.current?.contains(e.target as Node)) setMega(false); };
    document.addEventListener("mousedown", click); return () => document.removeEventListener("mousedown", click);
  }, [mega]);

  const openMega = () => { window.clearTimeout(closeTimer.current); setMega(true); };
  const closeMega = () => { closeTimer.current = window.setTimeout(() => setMega(false), 120); };
  const trap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !drawerRef.current) return;
    const f = drawerRef.current.querySelectorAll<HTMLElement>("a,button");
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const linkCls = ({ isActive }: { isActive: boolean }) => `nav-link relative py-2 text-[14px] font-medium transition-colors ${isActive ? "text-navy" : "text-navy/75 hover:text-navy"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-navy/15 bg-ivory/95 backdrop-blur-md">
      <div className="container-x flex h-[68px] items-center justify-between gap-6 lg:h-[84px]">
        <Link to="/" aria-label="MetaWealth Capital home" className="shrink-0"><Logo light={false} height={40} /></Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => n.mega ? (
            <div key={n.to} ref={megaRef} className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <div className="flex items-center gap-0.5">
                <NavLink to={n.to} className={({ isActive }) => linkCls({ isActive: isActive || pathname.startsWith("/services") })}>{({ isActive }) => (<>{n.label}<span className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-gold transition-transform duration-300 ${isActive || pathname.startsWith("/services") ? "scale-x-100" : "scale-x-0 nav-underline"}`} /></>)}</NavLink>
                <button aria-label="Toggle services menu" aria-expanded={mega} aria-controls="mega-menu" onClick={(e) => (e.detail === 0 ? setMega((m) => !m) : setMega(true))} className="p-1 text-navy/60 hover:text-navy">
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mega ? "rotate-180" : ""}`} aria-hidden />
                </button>
              </div>
              <AnimatePresence>
                {mega && (
                  <motion.div id="mega-menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.2 }}
                    className="absolute left-1/2 top-full w-[780px] -translate-x-1/2 pt-5" onMouseEnter={openMega} onMouseLeave={closeMega}>
                    <div className="grid grid-cols-[1fr_260px] border border-navy/15 bg-ivory shadow-lift">
                      <ul className="grid grid-cols-2 p-3">
                        {SERVICES.map((s, i) => (
                          <li key={s.slug}>
                            <Link to={`/services/${s.slug}`} className="group flex items-start gap-4 p-4 transition-colors hover:bg-sand">
                              <span className="pt-1 text-xs font-bold text-coral">{String(i + 1).padStart(2, "0")}</span>
                              <span><span className="block font-serif text-2xl leading-none text-navy">{s.title}</span><span className="mt-1.5 block text-xs leading-snug text-muted">{s.tagline}</span></span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-col justify-between bg-navy p-7">
                        <div><p className="eyebrow mb-3">Not sure where to start?</p><p className="font-serif text-3xl leading-[1.05] text-white">Begin with a conversation about your goals.</p></div>
                        <Link to="/book" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold hover:text-white">Schedule a call <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavLink key={n.to} to={n.to} end={n.end} className={linkCls}>{({ isActive }) => (<>{n.label}<span className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-gold transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 nav-underline"}`} /></>)}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/book" className="btn btn-navy hidden !min-h-[48px] !px-5 !text-[13px] xl:inline-flex">Schedule a Consultation <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
          <button className="p-2 text-navy lg:hidden" aria-label="Open menu" aria-expanded={drawer} aria-controls="mobile-drawer" onClick={() => setDrawer(true)}><Menu className="h-7 w-7" /></button>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {drawer && (
            <>
              <motion.div className="fixed inset-0 z-[60] bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
              <motion.div ref={drawerRef} id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Site menu" onKeyDown={trap}
                className="fixed inset-y-0 right-0 z-[70] flex w-[90%] max-w-sm flex-col bg-navy lg:hidden"
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <div className="flex h-[68px] items-center justify-between border-b border-white/15 px-6">
                  <Logo /><button aria-label="Close menu" className="p-2 text-white" onClick={() => setDrawer(false)}><X className="h-7 w-7" /></button>
                </div>
                <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-2">
                  {NAV.map((n) => n.mega ? (
                    <div key={n.to} className="border-b border-white/15">
                      <button className="flex min-h-[60px] w-full items-center justify-between font-serif text-4xl text-white" aria-expanded={mobileServices} onClick={() => setMobileServices((v) => !v)}>
                        Services <ChevronDown className={`h-5 w-5 text-gold transition-transform ${mobileServices ? "rotate-180" : ""}`} />
                      </button>
                      {mobileServices && (
                        <ul className="pb-3 pl-1">
                          <li><Link className="block min-h-[44px] py-2.5 text-sm font-bold text-gold" to="/services">All services</Link></li>
                          {SERVICES.map((s) => <li key={s.slug}><Link className="block min-h-[44px] py-2.5 text-sm text-white/80" to={`/services/${s.slug}`}>{s.title}</Link></li>)}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `flex min-h-[60px] items-center border-b border-white/15 font-serif text-4xl ${isActive ? "text-gold" : "text-white"}`}>{n.label}</NavLink>
                  ))}
                </nav>
                <div className="border-t border-white/15 p-6"><Link to="/book" className="btn btn-gold w-full">Schedule a Consultation <ArrowUpRight className="h-4 w-4" aria-hidden /></Link></div>
              </motion.div>
            </>
          )}
        </AnimatePresence>, document.body)}
    </header>
  );
}
