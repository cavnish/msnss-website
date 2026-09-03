"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Testimonial } from "@/db/schema";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-brand" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? "text-brand" : "text-slate-200"}>★</span>
      ))}
    </div>
  );
}

function Card({ t }: { t: Testimonial }) {
  const initial = (t.name?.[0] || "M").toUpperCase();
  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-xl font-bold text-white">&rdquo;</span>
      <div className="flex items-center justify-between pr-12">
        <Stars n={t.rating} />
        {t.verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            ✓ Verified
          </span>
        )}
      </div>
      <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">&ldquo;{t.content}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: t.accentColor }}>
          {initial}
        </span>
        <div>
          <div className="font-bold text-ink">{t.name}</div>
          {t.role && <div className="text-xs text-slate-500">{t.role}</div>}
          {t.company && <div className="text-xs font-semibold text-brand">{t.company}</div>}
        </div>
      </div>
      {t.timeAgo && <div className="mt-4 text-xs text-slate-400">{t.timeAgo}</div>}
    </div>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const reduce = useReducedMotion();
  const [page, setPage] = useState(0);
  const [perView, setPerView] = useState(3);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const update = () => setPerView(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pageCount = items.length ? Math.ceil(items.length / perView) : 0;

  // Auto-advance the carousel (pauses on hover / reduced motion / hidden tab).
  useEffect(() => {
    if (reduce || paused || pageCount < 2) return;
    const t = window.setInterval(() => setPage((p) => (p + 1) % pageCount), 5000);
    return () => window.clearInterval(t);
  }, [reduce, paused, pageCount]);
  useEffect(() => {
    const v = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", v);
    return () => document.removeEventListener("visibilitychange", v);
  }, []);

  if (!items.length) return null;
  const pages = pageCount;
  const safePage = Math.min(page, pages - 1);
  const start = safePage * perView;
  const visible = items.slice(start, start + perView);
  const avg = (items.reduce((s, t) => s + t.rating, 0) / items.length).toFixed(1);

  return (
    <section className="bg-white py-14" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-brand">Testimonials</span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
              What Our <span className="text-brand">Clients Say</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-ink">{avg}</span>
                <Stars n={Math.round(Number(avg))} />
              </div>
              <div className="text-xs text-slate-500">Based on {items.length} reviews</div>
            </div>
            {pages > 1 && (
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => (p - 1 + pages) % pages)} aria-label="Previous reviews" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-brand hover:text-brand">←</button>
                <button onClick={() => setPage((p) => (p + 1) % pages)} aria-label="Next reviews" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-brand hover:text-brand">→</button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={safePage}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visible.map((t) => (
                <Card key={t.id} t={t} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {pages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)} aria-label={`Go to review page ${i + 1}`} className={`h-2 rounded-full transition-all ${i === safePage ? "w-8 bg-brand" : "w-2 bg-slate-300 hover:bg-slate-400"}`} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5">
            <span className="text-sm font-bold uppercase tracking-wide text-emerald-600">Excellent</span>
            <Stars n={5} />
            <span className="text-sm text-slate-500">Based on {items.length} reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
