"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Catalogue } from "@/db/schema";

export function CatalogueDownload() {
  const [item, setItem] = useState<Catalogue | null | undefined>(undefined);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/catalogue").then((r) => r.json()).then(setItem).catch(() => setItem(null));
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!item) return;
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const r = await fetch("/api/catalogue", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, catalogueId: item.id }) });
    const j = await r.json();
    if (!r.ok) return setMessage(j.error || "Something went wrong.");
    setMessage("Thank you! Your catalogue is downloading.");
    window.open("/api/catalogue/download", "_blank", "noopener,noreferrer");
  }

  if (item === undefined) return <div className="shimmer h-48 rounded-2xl" />;

  if (!item)
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
        <div className="text-4xl">📄</div>
        <h3 className="mt-3 font-bold text-ink">Catalogue update in progress</h3>
        <p className="mt-2 text-sm text-slate-500">Please contact our sales team for the latest MSNSS catalogue.</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
    >
      <div className="grid lg:grid-cols-2">
        {/* One-click download side */}
        <div className="relative flex flex-col justify-center bg-gradient-to-br from-[#0a3470] to-[#0866c6] p-8 text-white sm:p-10">
          <div className="absolute inset-0 eng-grid-dark opacity-20" />
          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Active Catalogue</span>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">{item.title}</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/85">
              {item.description || "Download the complete MSNSS product catalogue — MS & SS ducting, accessories, coatings and machinery."}
            </p>
            <a
              href="/api/catalogue/download"
              target="_blank"
              rel="noreferrer"
              download
              className="group mt-7 inline-flex items-center gap-3 rounded-lg bg-white px-7 py-4 text-sm font-bold text-[#0a3470] shadow-lg transition hover:bg-slate-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download Catalogue PDF
            </a>
            <p className="mt-3 text-xs text-white/70">PDF · {item.fileName} · One-click download</p>
          </div>
        </div>

        {/* Optional lead form */}
        <div className="p-8 sm:p-10">
          <h3 className="text-lg font-extrabold text-ink">Want it emailed too?</h3>
          <p className="mt-1 text-sm text-slate-500">Optional — share your details and we&apos;ll keep you updated with new products.</p>
          <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
            <input required name="name" className="rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-brand" placeholder="Full name *" />
            <input name="company" className="rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-brand" placeholder="Company" />
            <input required type="email" name="email" className="rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-brand" placeholder="Email *" />
            <input required name="phone" className="rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-brand" placeholder="Phone *" />
            <button className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark sm:col-span-2">
              Send &amp; Download
            </button>
            {message && <p className="text-sm font-medium text-brand sm:col-span-2">{message}</p>}
          </form>
        </div>
      </div>
    </motion.div>
  );
}
