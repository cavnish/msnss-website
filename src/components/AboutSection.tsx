"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const FEATURES = [
  ["01", "Precision Fabrication", "MS & SS ducting made to approved drawings."],
  ["02", "Quality-Focused Production", "Controlled processes and careful finishing."],
  ["03", "Project Execution", "Coordinated supply, dispatch and timelines."],
  ["04", "Installation Expertise", "Skilled on-site duct installation support."],
] as const;

export function AboutSection() {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 eng-grid opacity-[0.35]" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-light/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[48%_52%] lg:gap-14">
        {/* LEFT — image composition */}
        <div className="relative">
          {/* corner brackets */}
          <span className="pointer-events-none absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-brand/40" aria-hidden />
          <span className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-brand/40 lg:block" aria-hidden />

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease }}
            className="zoom-frame overflow-hidden rounded-xl border border-slate-200 shadow-md"
          >
            { }
            <img
              src="/images/factory.jpg"
              alt="Inside the MSNSS HVAC duct manufacturing facility"
              loading="lazy"
              className="h-[300px] w-full object-cover sm:h-[380px] lg:h-[420px]"
            />
          </motion.div>

          {/* Secondary overlapping image */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="zoom-frame absolute -bottom-8 -right-3 hidden w-44 overflow-hidden rounded-xl border-4 border-white shadow-xl sm:block lg:w-52"
          >
            { }
            <img
              src="/images/hero-3.jpg"
              alt="MSNSS HVAC duct installation on site"
              loading="lazy"
              className="h-32 w-full object-cover lg:h-36"
            />
          </motion.div>

          {/* Floating technical badge */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.25, ease }}
            className="absolute left-4 top-4 rounded-lg border border-slate-200 bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur"
          >
            <div className="text-[10px] font-bold uppercase leading-tight tracking-[0.16em] text-brand">HVAC Engineering</div>
            <div className="text-[10px] font-semibold uppercase leading-tight tracking-[0.16em] text-slate-500">&amp; Fabrication</div>
          </motion.div>
        </div>

        {/* RIGHT — content */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="lg:pl-2"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
            <span className="h-px w-6 bg-brand/50" /> 01 / About MSNSS
          </span>

          <h2 className="mt-3 text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[34px]">
            Built for Performance.<br className="hidden sm:block" /> Engineered for Precision.
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            MSNSS – M S HVAC Engineers delivers complete MS &amp; SS HVAC ducting — from engineering and
            precision manufacturing to finishing, dispatch and site installation, all from our Vasai plant.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            Our approach combines technical expertise, controlled fabrication and reliable execution to
            deliver ducting built for performance and long-term reliability.
          </p>

          {/* Feature grid */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {FEATURES.map(([n, title, desc], i) => (
              <motion.div
                key={n}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease }}
                className="group rounded-[10px] border border-slate-200 bg-slate-50/60 p-3.5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white"
              >
                <div className="text-[11px] font-bold text-brand">{n}</div>
                <h3 className="mt-1 text-[13px] font-bold leading-snug text-ink sm:text-sm">{title}</h3>
                <p className="mt-1 text-[11px] leading-snug text-slate-500 sm:text-xs">{desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.5, ease }}
            className="mt-6 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-brand-dark"
            >
              Explore Our Capabilities <span aria-hidden>→</span>
            </Link>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Vasai, Maharashtra</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
