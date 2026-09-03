"use client";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Service } from "@/db/schema";

const IMAGES = ["/images/hero-1.jpg", "/images/factory.jpg", "/images/hero-3.jpg", "/images/about.jpg", "/images/fire-rated.jpg", "/images/hero-2.jpg"];

export function SolutionsShowcase({ services }: { services: Service[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  if (!services.length) return null;
  const current = services[active];
  const image = IMAGES[active % IMAGES.length];

  return (
    <div className="grid items-stretch gap-8 lg:grid-cols-2">
      {/* Left: solution list */}
      <div className="flex flex-col gap-2">
        {services.map((service, idx) => {
          const isActive = idx === active;
          return (
            <button
              key={service.id}
              onMouseEnter={() => setActive(idx)}
              onFocus={() => setActive(idx)}
              onClick={() => setActive(idx)}
              className={`group flex items-center justify-between rounded-2xl border px-6 py-5 text-left transition ${
                isActive ? "border-brand bg-brand-light/60 shadow-sm" : "border-slate-200 bg-white hover:border-brand/40"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition ${isActive ? "bg-brand text-white" : "bg-slate-100 text-brand"}`}>
                  {service.icon || "▪"}
                </span>
                <div>
                  <h3 className={`text-lg font-bold ${isActive ? "text-brand" : "text-ink"}`}>{service.name}</h3>
                  <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{service.shortDescription}</p>
                </div>
              </div>
              <span className={`text-lg transition ${isActive ? "translate-x-0 text-brand" : "-translate-x-1 text-slate-300 group-hover:text-brand"}`}>→</span>
            </button>
          );
        })}
      </div>

      {/* Right: image + description */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            { }
            <img src={image} alt={`${current.name} by MSNSS`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
          </motion.div>
        </AnimatePresence>
        <div className="relative flex h-full min-h-80 flex-col justify-end p-8 text-white">
          <AnimatePresence mode="wait">
            <motion.div key={current.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">HVAC Solution</span>
              <h3 className="mt-2 text-2xl font-extrabold">{current.name}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">{current.fullDescription || current.shortDescription}</p>
              <Link href={`/solutions/${current.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:bg-slate-100">
                Explore Solution →
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
