"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { PRODUCT_LINKS, PROJECT_LINKS, SITE, SOLUTION_LINKS } from "@/lib/site";

function Dropdown({ label, href, links }: { label: string; href: string; links: readonly (readonly [string, string])[] }) {
  return (
    <div className="group relative">
      <Link href={href} className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-light hover:text-brand">
        {label}<span aria-hidden="true">⌄</span>
      </Link>
      <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-2 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {links.map(([name, url]) => (
          <Link key={url} href={url} className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-brand-light hover:text-brand">
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes (deferred to avoid a
  // synchronous setState during the effect commit).
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      {/* Top utility bar (desktop only) */}
      <div className="hidden bg-slate-900 text-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <span className="tracking-wide text-slate-300">Ducting <span className="text-brand">•</span> Fabrication <span className="text-brand">•</span> Installation</span>
          <div className="flex items-center gap-5 text-slate-300">
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-white">{SITE.phones[0]}</a>
            <a href={`mailto:${SITE.emails[0]}`} className="hover:text-white">{SITE.emails[0]}</a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href="/" aria-label="MSNSS home" className="shrink-0"><Logo /></Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-light hover:text-brand">Home</Link>
          <Link href="/about" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-light hover:text-brand">About</Link>
          <Dropdown label="Products" href="/products" links={PRODUCT_LINKS} />
          <Dropdown label="Solutions" href="/solutions" links={SOLUTION_LINKS} />
          <Link href="/plant-and-machinery" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-light hover:text-brand">Plant &amp; Machinery</Link>
          <Dropdown label="Projects" href="/projects" links={PROJECT_LINKS} />
          <Link href="/contact" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-light hover:text-brand">Contact</Link>
          <Link href="/contact" className="ml-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-dark">Get a Quote</Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 text-slate-700 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 top-[61px] z-40 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            id="mobile-menu"
            className="fixed inset-x-0 top-[61px] z-40 max-h-[calc(100dvh-61px)] animate-fade-up overflow-y-auto border-t border-slate-200 bg-white lg:hidden"
          >
            <nav className="space-y-1 px-4 pb-6 pt-3" aria-label="Mobile navigation">
              <Link href="/" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-brand-light hover:text-brand">Home</Link>
              <Link href="/about" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-brand-light hover:text-brand">About</Link>

              <details className="rounded-lg border border-slate-200">
                <summary className="cursor-pointer list-none px-3 py-3 text-sm font-semibold text-slate-800">Products</summary>
                <div className="border-t border-slate-100 p-1.5">{PRODUCT_LINKS.map(([n, u]) => <Link key={u} href={u} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-sm text-slate-600 hover:bg-brand-light hover:text-brand">{n}</Link>)}</div>
              </details>

              <details className="rounded-lg border border-slate-200">
                <summary className="cursor-pointer list-none px-3 py-3 text-sm font-semibold text-slate-800">Solutions</summary>
                <div className="border-t border-slate-100 p-1.5">{SOLUTION_LINKS.map(([n, u]) => <Link key={u} href={u} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-sm text-slate-600 hover:bg-brand-light hover:text-brand">{n}</Link>)}</div>
              </details>

              <Link href="/plant-and-machinery" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-brand-light hover:text-brand">Plant &amp; Machinery</Link>

              <details className="rounded-lg border border-slate-200">
                <summary className="cursor-pointer list-none px-3 py-3 text-sm font-semibold text-slate-800">Projects</summary>
                <div className="border-t border-slate-100 p-1.5">{PROJECT_LINKS.map(([n, u]) => <Link key={u} href={u} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-sm text-slate-600 hover:bg-brand-light hover:text-brand">{n}</Link>)}</div>
              </details>

              <Link href="/catalogue" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-brand-light hover:text-brand">Catalogue</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-brand-light hover:text-brand">Contact</Link>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <Link href="/contact" onClick={() => setOpen(false)} className="rounded-lg bg-brand px-4 py-3 text-center text-sm font-semibold text-white">Get a Quote</Link>
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700">WhatsApp</a>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
