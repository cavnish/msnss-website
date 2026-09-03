"use client";

import { useEffect, useState } from "react";
import { AdminPage, Modal, Field, inputCls, EmptyState, TableSkeleton } from "@/components/admin/AdminUI";
import type { Service } from "@/db/schema";

type Form = {
  id?: number; name: string; slug: string; icon: string;
  shortDescription: string; fullDescription: string;
  imageUrl: string; gallery: string; videoUrl: string; highlights: string;
  sortOrder: number; active: boolean;
};

const empty: Form = { name: "", slug: "", icon: "🔧", shortDescription: "", fullDescription: "", imageUrl: "", gallery: "", videoUrl: "", highlights: "", sortOrder: 0, active: false };

function toForm(s: Service): Form {
  return {
    id: s.id, name: s.name, slug: s.slug, icon: s.icon,
    shortDescription: s.shortDescription, fullDescription: s.fullDescription,
    imageUrl: s.imageUrl ?? "", gallery: (s.gallery ?? []).join("\n"),
    videoUrl: s.videoUrl ?? "", highlights: (s.highlights ?? []).join(", "),
    sortOrder: s.sortOrder, active: s.active,
  };
}

export default function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    setItems(await (await fetch("/api/admin/services")).json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const payload = {
      ...form,
      gallery: form.gallery.split(/[\n,]/).map((s) => s.trim()).filter(Boolean),
      highlights: form.highlights.split(",").map((s) => s.trim()).filter(Boolean),
      imageUrl: form.imageUrl.trim() || null,
      videoUrl: form.videoUrl.trim() || null,
    };
    const url = form.id ? `/api/admin/services/${form.id}` : "/api/admin/services";
    const response = await fetch(url, { method: form.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) { setNotice(result.error || "Unable to save solution. Please try again."); return; }
    setNotice(`Solution ${form.id ? "updated" : "created"} successfully.`);
    setForm(null); load();
  }
  async function remove(id: number) {
    if (!confirm("Delete this service?")) return;
    const response = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (!response.ok) { setNotice("Unable to delete solution. Please try again."); return; }
    setItems((p) => p.filter((x) => x.id !== id));
    setNotice("Solution deleted successfully.");
  }

  async function uploadTo(target: "main" | "gallery", files: FileList | null) {
    if (!files || !form) return;
    setNotice("Uploading media...");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("category", "projects");
        const r = await fetch("/api/admin/media", { method: "POST", body: fd });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        urls.push(j.url);
      }
      setForm((f) => {
        if (!f) return f;
        if (target === "main") return { ...f, imageUrl: urls[0] };
        const existing = f.gallery ? f.gallery + "\n" : "";
        return { ...f, gallery: existing + urls.join("\n") };
      });
      setNotice("Media uploaded successfully.");
    } catch (e) {
      setNotice((e as Error).message || "Upload failed. Configure Supabase Storage or paste a URL instead.");
    }
  }

  return (
    <AdminPage title="Solutions" action={<button onClick={() => setForm(empty)} className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">+ Add Service</button>}>
      {notice && <button onClick={() => setNotice("")} className="mb-4 w-full rounded-lg bg-blue-50 p-3 text-left text-sm text-blue-800">{notice} ×</button>}
      {loading ? <TableSkeleton /> : items.length === 0 ? (
        <EmptyState icon="🔧" title="No services" text="Add your first service." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-3">Service</th><th className="p-3">Media</th><th className="p-3">Active</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {s.imageUrl ? <img src={s.imageUrl} alt="" className="h-10 w-10 rounded object-cover" /> : <span className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-lg">{s.icon || "◇"}</span>}
                      <span className="font-medium text-ink">{s.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-slate-500">{(s.gallery?.length || 0)} photo{(s.gallery?.length || 0) === 1 ? "" : "s"}{s.videoUrl ? " · video" : ""}</td>
                  <td className="p-3">{s.active ? "✅" : "—"}</td>
                  <td className="p-3"><div className="flex gap-2">
                    <button onClick={() => setForm(toForm(s))} className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold hover:bg-slate-200">Edit</button>
                    <button onClick={() => remove(s.id)} className="rounded bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100">Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit Service" : "Add Service"}>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name"><input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Icon (emoji)"><input className={inputCls} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></Field>
            </div>
            <Field label="Short Description"><input required className={inputCls} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></Field>
            <Field label="Full Description"><textarea required rows={4} className={inputCls} value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} /></Field>
            <Field label="Highlights (comma separated)"><input className={inputCls} value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} placeholder="Drawing-based execution, MS & SS options" /></Field>
            <Field label="Main Image URL">
              <div className="flex gap-2">
                <input className={inputCls} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="/images/factory.jpg" />
                <label className="cursor-pointer whitespace-nowrap rounded-md border px-3 py-2 text-xs font-semibold">Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => uploadTo("main", e.target.files)} /></label>
              </div>
            </Field>
            {form.imageUrl && <img src={form.imageUrl} alt="Main preview" className="h-32 w-full rounded-lg object-cover" />}
            <Field label="Photo Gallery (one image URL per line)">
              <div className="mb-2"><label className="cursor-pointer rounded-md border px-3 py-2 text-xs font-semibold">Upload Photos<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadTo("gallery", e.target.files)} /></label></div>
              <textarea rows={3} className={inputCls} value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} placeholder="https://.../photo-1.jpg" />
            </Field>
            <Field label="Video URL (MP4/WebM link)"><input className={inputCls} value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://.../service-demo.mp4" /></Field>
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
