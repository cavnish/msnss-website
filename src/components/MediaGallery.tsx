"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type MediaItem = { type: "image" | "video"; url: string };

export function MediaGallery({ mainImage, gallery = [], videoUrl, alt }: { mainImage: string; gallery?: string[]; videoUrl?: string | null; alt: string }) {
  const reduce = useReducedMotion();
  const items: MediaItem[] = [
    { type: "image" as const, url: mainImage },
    ...gallery.filter(Boolean).map((url) => ({ type: "image" as const, url })),
    ...(videoUrl ? [{ type: "video" as const, url: videoUrl }] : []),
  ];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const current = items[active] ?? items[0];

  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % items.length);
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = prev; };
  }, [lightbox, items.length]);

  return (
    <div>
      <div className="zoom-frame relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {current.type === "video" ? (
              <video className="h-[300px] w-full object-cover sm:h-[440px]" src={current.url} controls playsInline preload="metadata" />
            ) : (
              <button onClick={() => setLightbox(true)} className="block w-full" aria-label="Open image">
                { }
                <img src={current.url} alt={alt} className="h-[300px] w-full object-cover sm:h-[440px]" />
              </button>
            )}
          </motion.div>
        </AnimatePresence>
        {current.type === "image" && (
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white">Click to zoom</span>
        )}
        {items.length > 1 && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white">
            {active + 1} / {items.length}
          </span>
        )}
      </div>

      {items.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {items.map((item, idx) => (
            <button
              key={`${item.url}-${idx}`}
              onClick={() => setActive(idx)}
              aria-label={`View media ${idx + 1}`}
              className={`zoom-frame relative h-16 w-20 overflow-hidden rounded-lg border-2 transition ${idx === active ? "border-brand" : "border-slate-200 hover:border-brand/50"}`}
            >
              {item.type === "video" ? (
                <span className="flex h-full w-full items-center justify-center bg-slate-900 text-lg text-white">▶</span>
              ) : (
                 
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && current.type === "image" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/95 p-4" onClick={() => setLightbox(false)}>
            <button className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-white" aria-label="Close">✕</button>
            {items.length > 1 && <button onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + items.length) % items.length); }} className="absolute left-4 rounded-full bg-white/10 p-3 text-white" aria-label="Previous">←</button>}
            { }
            <img src={current.url} alt={alt} className="max-h-[85vh] max-w-6xl object-contain" onClick={(e) => e.stopPropagation()} />
            {items.length > 1 && <button onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % items.length); }} className="absolute right-4 rounded-full bg-white/10 p-3 text-white" aria-label="Next">→</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
