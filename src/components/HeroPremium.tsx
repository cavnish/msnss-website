"use client";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { HeroSlide } from "@/db/schema";

const AUTOPLAY = 6000;

const TRUST = [
  { big: "25+", top: "YEARS OF", bottom: "EXPERIENCE", icon: "shield" },
  { big: "2,000", top: "SQM MONTHLY", bottom: "CAPACITY", icon: "building" },
  { big: "MS & SS", top: "DUCT", bottom: "MANUFACTURING", icon: "badge" },
  { big: "SITE", top: "INSTALLATION", bottom: "SUPPORT", icon: "pin" },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    factory: <><path d="M3 21V9l6 4V9l6 4V5l6 4v12z" {...p} /><path d="M7 21v-4M12 21v-4M17 21v-4" {...p} /></>,
    wrench: <><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z" {...p} /></>,
    hardhat: <><path d="M4 15a8 8 0 0 1 16 0" {...p} /><path d="M2 18h20M10 6.5V4h4v2.5" {...p} /></>,
    wind: <><path d="M3 8h11a3 3 0 1 0-3-3M3 16h15a3 3 0 1 1-3 3M3 12h8" {...p} /></>,
    shield: <><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" {...p} /></>,
    building: <><path d="M4 21V5l8-2v18M12 21h8V9l-8-3M8 8h0M8 12h0M8 16h0M16 12h0M16 16h0" {...p} /></>,
    badge: <><circle cx="12" cy="10" r="6" {...p} /><path d="M9 15l-1 6 4-2 4 2-1-6" {...p} /></>,
    pin: <><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" {...p} /><circle cx="12" cy="10" r="2.5" {...p} /></>,
  };
  return <svg viewBox="0 0 24 24" className={className}>{paths[name]}</svg>;
}

export function HeroPremium({ slides }: { slides: HeroSlide[] }) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused || reduce) return;
    const t = window.setInterval(next, AUTOPLAY);
    return () => window.clearInterval(t);
  }, [count, paused, reduce, next]);
  useEffect(() => {
    const v = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", v);
    return () => document.removeEventListener("visibilitychange", v);
  }, []);

  if (!count) return null;
  const slide = slides[current];
  const image = slide.imageUrl || "/images/hero-1.jpg";
  // Two-tone heading: split title roughly in half (white / brand blue).
  const words = slide.title.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden bg-[#06111f] text-white"
      aria-label="MSNSS hero"
    >
      {/* Background slider */}
      <AnimatePresence mode="sync">
        <motion.div key={slide.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1 }} className="absolute inset-0">
          <motion.img
            src={image}
            alt=""
            initial={reduce ? { scale: 1 } : { scale: 1.09 }}
            animate={{ scale: 1 }}
            transition={{ duration: 7, ease: "easeOut" }}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlays for readability */}
      <div className="absolute inset-0 bg-[#03101e]/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#03101e] via-[#03101e]/85 to-[#03101e]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03101e] via-transparent to-[#03101e]/30" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-brand/15 blur-[130px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:py-24">
        {/* Left */}
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div key={slide.id} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.55 }}>
              <span className="inline-flex -skew-x-6 items-center gap-2 bg-brand px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg">
                <span className="skew-x-6">M S HVAC Engineers</span>
              </span>

              <h1 className="mt-6 text-4xl font-black uppercase leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block">{line1}</span>
                {line2 && <span className="block text-[#1686e8]">{line2}</span>}
              </h1>

              {slide.supportingLine && (
                <p className="mt-5 text-lg font-semibold uppercase tracking-[0.06em] text-white/90 sm:text-xl">{slide.supportingLine}</p>
              )}

              <div className="mt-5 h-1 w-20 rounded-full bg-brand" />

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{slide.subtitle}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={slide.primaryCtaLink || "/products"} className="group inline-flex items-center gap-2 rounded-lg bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(14,124,196,.35)] transition hover:bg-brand-dark">
                  {slide.primaryCtaLabel || "Explore Solutions"}
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </Link>
                <Link href={slide.secondaryCtaLink || "/contact"} className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-[#071426]">
                  {slide.secondaryCtaLabel || "Request a Quote"}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Trust points */}
          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-5 border-t border-white/15 pt-7 sm:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.bottom} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/10 text-cyan-300">
                  <Icon name={t.icon} className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-lg font-extrabold leading-none text-white">{t.big}</div>
                  <div className="mt-1 text-[10px] font-bold leading-tight tracking-wide text-slate-300">{t.top}<br />{t.bottom}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Controls */}
      {count > 1 && (
        <div className="absolute bottom-6 left-6 right-6 z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button key={s.id} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === current} className={`h-1 rounded-full transition-all ${i === current ? "w-12 bg-brand" : "w-5 bg-white/30 hover:bg-white/60"}`} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={prev} aria-label="Previous slide" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur transition hover:bg-white hover:text-[#071426]"><Icon name="wind" className="hidden" /><span aria-hidden>←</span></button>
              <button onClick={next} aria-label="Next slide" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur transition hover:bg-white hover:text-[#071426]"><span aria-hidden>→</span></button>
            </div>
          </div>
        </div>
      )}

      {/* Autoplay progress */}
      {!paused && !reduce && count > 1 && (
        <motion.div key={current} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: AUTOPLAY / 1000, ease: "linear" }} className="absolute bottom-0 left-0 z-30 h-[3px] bg-brand" />
      )}
    </section>
  );
}
