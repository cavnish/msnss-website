import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Motion";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={`mb-8 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <span className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand ${center ? "justify-center" : ""}`}>
          <span className="h-px w-6 bg-brand/50" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-[15px] ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

export function PageHeader({
  title,
  subtitle,
  crumb,
}: {
  title: string;
  subtitle?: string;
  crumb?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-brand-light/60 to-white py-12 sm:py-14">
      <div className="absolute inset-0 eng-grid opacity-40" />
      <div className="pointer-events-none absolute -right-20 -top-16 h-72 w-72 rounded-full bg-brand-light/70 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        {crumb && (
          <div className="mb-2 text-[13px] text-slate-500">
            <Link href="/" className="font-medium hover:text-brand">
              Home
            </Link>{" "}
            / <span className="text-slate-700">{crumb}</span>
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2.5 max-w-2xl text-sm text-slate-600 sm:text-[15px]">{subtitle}</p>}
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0a3470] to-[#0866c6] py-12 text-white sm:py-14">
      <div className="absolute inset-0 eng-grid-dark opacity-20" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">Let&apos;s Build Together</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Planning Your Next HVAC Ducting Project?
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-[15px]">
            Talk to our engineering team about fabrication, supply and installation.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0a3470] shadow-sm transition hover:bg-slate-100">
            Request a Quote
          </Link>
          <a href="https://wa.me/917021094388" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#0a3470]">
            <svg viewBox="0 0 32 32" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M16 3.2A12.8 12.8 0 0 0 4.9 22.4L3.2 28.8l6.6-1.7A12.8 12.8 0 1 0 16 3.2Zm0 23a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4 1.02 1.07-3.9-.25-.4A10.6 10.6 0 1 1 16 26.2Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.1-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.21-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.67 0 1.57 1.15 3.09 1.31 3.3.16.21 2.25 3.44 5.46 4.83.76.33 1.36.53 1.82.67.77.25 1.46.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z"/></svg>
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
