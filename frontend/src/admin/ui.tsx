import { ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; prev?.focus(); };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-10" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`w-full bg-white shadow-lift outline-none ${wide ? "max-w-3xl" : "max-w-lg"}`}>
        <div className="flex items-center justify-between border-b border-navy/10 px-6 py-4"><h2 className="font-serif text-xl">{title}</h2><button onClick={onClose} aria-label="Close" className="p-1 hover:text-gold"><X className="h-5 w-5" /></button></div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Confirm({ title, text, confirmLabel = "Delete", onConfirm, onCancel }: { title: string; text: string; confirmLabel?: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-muted">{text}</p>
      <div className="mt-6 flex justify-end gap-3"><button className="btn btn-outline-dark !min-h-[40px]" onClick={onCancel}>Cancel</button><button className="btn !min-h-[40px] bg-red-700 text-white hover:bg-red-800" onClick={onConfirm}>{confirmLabel}</button></div>
    </Modal>
  );
}

export function Pager({ page, pages, total, set }: { page: number; pages: number; total: number; set: (p: number) => void }) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted">
      <span>{total} record{total === 1 ? "" : "s"}</span>
      <div className="flex items-center gap-2"><button className="border border-navy/20 px-3 py-1.5 disabled:opacity-40" disabled={page <= 1} onClick={() => set(page - 1)}>Prev</button><span>Page {page} / {pages}</span><button className="border border-navy/20 px-3 py-1.5 disabled:opacity-40" disabled={page >= pages} onClick={() => set(page + 1)}>Next</button></div>
    </div>
  );
}

export const Badge = ({ children, tone = "gray" }: { children: ReactNode; tone?: "green" | "gray" | "gold" | "red" }) => (
  <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${{ green: "bg-emerald-100 text-emerald-800", gray: "bg-navy/10 text-navy/70", gold: "bg-gold/25 text-gold-dark", red: "bg-red-100 text-red-800" }[tone]}`}>{children}</span>
);

export function Toast({ msg, tone = "ok" }: { msg: string; tone?: "ok" | "err" }) {
  if (!msg) return null;
  return <div role="status" className={`fixed bottom-6 right-6 z-[80] px-5 py-3 text-sm text-white shadow-lift ${tone === "ok" ? "bg-navy" : "bg-red-700"}`}>{msg}</div>;
}
