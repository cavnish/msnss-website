"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Item = { type: "image" | "video"; url: string };

export function MediaShowcase({
  mainImage,
  gallery = [],
  videoUrl,
  alt,
}: {
  mainImage: string;
  gallery?: string[];
  videoUrl?: string | null;
  alt: string;
}) {
  const reduce = useReducedMotion();
  const items: Item[] = [
    { type: "image", url: mainImage },
    ...gallery.filter(Boolean).map((url) => ({ type: "image" as const, url })),
    ...(videoUrl ? [{ type: "video" as const, url: videoUrl }] : []),
  ];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % items.length);
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = prev; };
  }, [open, items.length]);

  if (items.length === 0) return null;

  function launch(i: number) { setActive(i); setOpen(true); }

  // Modern grid: 1 large tile + up to 4 supporting tiles; last shows "+N more" if overflow.
  const grid = items.slice(0, 5);
  const extra = items.length - grid.length;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
        {grid.map((item, i) => {
          const isFeatured = i === 0;
          const isLastTile = i === grid.length - 1 && extra > 0;
          return (
            <motion.button
              key={`${item.url}-${i}`}
              onClick={() => launch(i)}
              aria-label={item.type === "video" ? "Play product video" : "View product image"}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`zoom-frame group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm ${
                isFeatured ? "col-span-2 row-span-2 h-64 sm:h-80 lg:h-full" : "h-32 sm:h-40 lg:h-full"
              }`}
            >
              {item.type === "video" ? (
                <>
                  { }
                  <img src={mainImage} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg transition group-hover:scale-110">▶</span>
                  </span>
                  <span className="absolute bottom-2 left-2 rounded-md bg-slate-950/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Video</span>
                </>
              ) : (
                 
                <img src={item.url} alt={`${alt} ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
              )}

              {/* "+N more" overlay on the last visible tile */}
              {isLastTile && (
                <span className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 text-white">
                  <span className="text-xl font-extrabold">+{extra}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide">See more</span>
                </span>
              )}

              {/* Hover hint */}
              {!isLastTile && item.type === "image" && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/0 text-xs font-semibold text-white opacity-0 transition group-hover:bg-slate-950/30 group-hover:opacity-100">
                  Click to view
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Click-to-see-more button */}
      <button
        onClick={() => launch(0)}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
        Click to See More Images ({items.length})
      </button>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-slate-950/95 p-4"
            onClick={() => setOpen(false)}
          >
            <button className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-white transition hover:bg-white/20" aria-label="Close">✕</button>
            {items.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + items.length) % items.length); }} className="absolute left-3 rounded-full bg-white/10 p-3 text-white transition hover:bg-brand sm:left-6" aria-label="Previous">←</button>
            )}
            <motion.div
              key={active}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-h-[85vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {current.type === "video" ? (
                <video src={current.url} controls autoPlay playsInline className="max-h-[85vh] w-full rounded-lg" />
              ) : (
                 
                <img src={current.url} alt={alt} className="max-h-[85vh] w-full rounded-lg object-contain" />
              )}
            </motion.div>
            {items.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % items.length); }} className="absolute right-3 rounded-full bg-white/10 p-3 text-white transition hover:bg-brand sm:right-6" aria-label="Next">→</button>
            )}
            <div className="mt-4 text-xs font-semibold text-white/80">{active + 1} / {items.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
