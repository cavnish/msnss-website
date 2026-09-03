"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type Stat = { label: string; value: string };

export function DetailHero({
  eyebrow,
  category,
  title,
  subtitle,
  image,
  crumbs,
  primary,
  secondary,
  stats = [],
}: {
  eyebrow: string;
  category?: string;
  title: string;
  subtitle?: string | null;
  image: string;
  crumbs: { label: string; href?: string }[];
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  stats?: Stat[];
}) {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative overflow-hidden bg-[#06111f] text-white">
      {/* Background image with slow zoom */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease }}
        className="absolute inset-0"
      >
        { }
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-[#03101e]/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#03101e] via-[#03101e]/80 to-[#03101e]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03101e] via-transparent to-[#03101e]/20" />
      <div className="absolute inset-0 eng-grid-dark opacity-20" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-brand/20 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16 lg:py-20">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-slate-300/80" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c.label}>
              {c.href ? (
                <Link href={c.href} className="font-medium transition hover:text-white">{c.label}</Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
              {i < crumbs.length - 1 && <span className="mx-1.5 text-slate-500">/</span>}
            </span>
          ))}
        </nav>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mt-5 max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> {eyebrow}
          </span>
          {category && (
            <span className="ml-2 inline-block rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {category}
            </span>
          )}

          <h1 className="mt-5 text-3xl font-bold leading-[1.08] tracking-tight drop-shadow sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-200 sm:text-lg">{subtitle}</p>
          )}

          {(primary || secondary) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {primary && (
                <Link href={primary.href} className="group inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-dark">
                  {primary.label} <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </Link>
              )}
              {secondary && (
                <Link href={secondary.href} className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#071426]">
                  {secondary.label}
                </Link>
              )}
            </div>
          )}
        </motion.div>

        {/* Stats strip */}
        {stats.length > 0 && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="mt-9 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-6 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-lg font-extrabold leading-none text-white">{s.value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
