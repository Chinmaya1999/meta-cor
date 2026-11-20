import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, ArrowUpRight } from "lucide-react";
import { useSite } from "@/hooks/useSite";

/** Thumb-reach call/book bar for phones; appears after the first screen, hidden where the page is itself a form. */
export function MobileCta() {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  const site = useSite();
  useEffect(() => {
    const on = () => setShow(window.scrollY > 520);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (pathname === "/book" || pathname === "/contact") return null;
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-navy/15 bg-ivory/95 px-3 pt-2.5 backdrop-blur-md transition-transform duration-300 lg:hidden ${show ? "translate-y-0" : "translate-y-full"}`} style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}>
      <a href={site.phoneHref} aria-label={`Call ${site.phone}`} className="btn btn-outline-dark !min-h-[52px] !px-4"><Phone className="h-5 w-5" aria-hidden /></a>
      <Link to="/book" className="btn btn-gold !min-h-[52px] flex-1">Book a consultation <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
    </div>
  );
}
