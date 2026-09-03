"use client";

import { useEffect, useState } from "react";
import { AdminPage, Modal, Field, inputCls, EmptyState, TableSkeleton } from "@/components/admin/AdminUI";
import type { HeroSlide } from "@/db/schema";

type Form = {
  id?: number; title: string; subtitle: string; supportingLine: string; imageUrl: string; videoUrl: string;
  primaryCtaLabel: string; primaryCtaLink: string; secondaryCtaLabel: string; secondaryCtaLink: string;
  sortOrder: number; active: boolean;
};

const empty: Form = {
  title: "", subtitle: "", supportingLine: "", imageUrl: "/images/hero-1.jpg", videoUrl: "",
  primaryCtaLabel: "Get a Quote", primaryCtaLink: "/contact",
  secondaryCtaLabel: "View Products", secondaryCtaLink: "/products",
  sortOrder: 0, active: true,
};

export default function HeroSlidesAdmin() {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setItems(await (await fetch("/api/admin/hero-slides")).json());
    setLoading(false);
  }
  useEffect(() => { const id = requestAnimationFrame(() => load()); return () => cancelAnimationFrame(id); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const url = form.id ? `/api/admin/hero-slides/${form.id}` : "/api/admin/hero-slides";
    await fetch(url, { method: form.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, videoUrl: form.videoUrl.trim() || null }) });
    setSaving(false); setForm(null); load();
  }
  async function remove(id: number) {
    if (!confirm("Delete this slide?")) return;
    setItems((p) => p.filter((x) => x.id !== id));
    await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
  }

  return (
    <AdminPage title="Hero Slider" action={<button onClick={() => setForm(empty)} className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">+ Add Slide</button>}>
      {loading ? <TableSkeleton /> : items.length === 0 ? (
        <EmptyState icon="🖼️" title="No slides" text="Add slides for the homepage hero slider." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <div key={s.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              { }
              <img src={s.imageUrl} alt="" className="h-32 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-ink line-clamp-1">{s.title}</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{s.subtitle}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setForm({ ...s, supportingLine: s.supportingLine ?? "", videoUrl: s.videoUrl ?? "", primaryCtaLabel: s.primaryCtaLabel ?? "", primaryCtaLink: s.primaryCtaLink ?? "", secondaryCtaLabel: s.secondaryCtaLabel ?? "", secondaryCtaLink: s.secondaryCtaLink ?? "" })} className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold hover:bg-slate-200">Edit</button>
                  <button onClick={() => remove(s.id)} className="rounded bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100">Delete</button>
                  {s.active ? <span className="ml-auto text-xs text-green-600">Active</span> : <span className="ml-auto text-xs text-slate-400">Hidden</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit Slide" : "Add Slide"}>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Title"><input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Subtitle"><textarea required rows={2} className={inputCls} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></Field>
            <Field label="Supporting Line"><input className={inputCls} value={form.supportingLine} onChange={(e) => setForm({ ...form, supportingLine: e.target.value })} /></Field>
            <Field label="Image URL (used as background & video poster)"><input className={inputCls} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></Field>
            <Field label="Background Video URL (optional MP4/WebM — plays fullscreen)"><input className={inputCls} value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://.../hero.mp4" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Primary Button Label"><input className={inputCls} value={form.primaryCtaLabel} onChange={(e) => setForm({ ...form, primaryCtaLabel: e.target.value })} /></Field>
              <Field label="Primary Button Link"><input className={inputCls} value={form.primaryCtaLink} onChange={(e) => setForm({ ...form, primaryCtaLink: e.target.value })} /></Field>
              <Field label="Secondary Button Label"><input className={inputCls} value={form.secondaryCtaLabel} onChange={(e) => setForm({ ...form, secondaryCtaLabel: e.target.value })} /></Field>
              <Field label="Secondary Button Link"><input className={inputCls} value={form.secondaryCtaLink} onChange={(e) => setForm({ ...form, secondaryCtaLink: e.target.value })} /></Field>
            </div>
            <Field label="Sort Order"><input type="number" className={inputCls} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setForm(null)} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
              <button disabled={saving} className="rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        )}
      </Modal>
    </AdminPage>
  );
}
