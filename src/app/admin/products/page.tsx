"use client";

import { useEffect, useState } from "react";
import { AdminPage, Modal, Field, inputCls, EmptyState, TableSkeleton } from "@/components/admin/AdminUI";
import { PRODUCT_CATEGORIES } from "@/lib/site";
import type { Product } from "@/db/schema";

type Form = {
  id?: number;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  applications: string;
  specifications: string;
  features: string;
  gallery: string;
  videoUrl: string;
  sortOrder: number;
  active: boolean;
};

const empty: Form = {
  name: "", slug: "", category: PRODUCT_CATEGORIES[0], shortDescription: "",
  fullDescription: "", imageUrl: "/images/products/ms-rectangular.jpg",
  applications: "", specifications: "", features: "", gallery: "", videoUrl: "", sortOrder: 0, active: false,
};

function toForm(p: Product): Form {
  return {
    id: p.id, name: p.name, slug: p.slug, category: p.category,
    shortDescription: p.shortDescription, fullDescription: p.fullDescription,
    imageUrl: p.imageUrl, applications: p.applications.join(", "),
    specifications: p.specifications.join(", "), features: p.features.join(", "),
    gallery: (p.gallery ?? []).join("\n"), videoUrl: p.videoUrl ?? "",
    sortOrder: p.sortOrder, active: p.active,
  };
}

export default function ProductsAdmin() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState("all");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
    const selected = new URLSearchParams(window.location.search).get("category");
    if (selected && PRODUCT_CATEGORIES.includes(selected)) setCategory(selected);
  }, []);
  const visibleItems = category === "all" ? items : items.filter((item) => item.category === category);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const payload = {
      ...form,
      applications: form.applications.split(",").map((s) => s.trim()).filter(Boolean),
      specifications: form.specifications.split(",").map((s) => s.trim()).filter(Boolean),
      features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
      gallery: form.gallery.split(/[\n,]/).map((s) => s.trim()).filter(Boolean),
      videoUrl: form.videoUrl.trim() || null,
    };
    const url = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
    const response = await fetch(url, {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) { setNotice(result.error || "Unable to save product. Please try again."); return; }
    setNotice(`Product ${form.id ? "updated" : "created"} successfully.`);
    setForm(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this product?")) return;
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!response.ok) { setNotice("Unable to delete product. Please try again."); return; }
    setItems((p) => p.filter((x) => x.id !== id));
    setNotice("Product deleted successfully.");
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
    <AdminPage
      title="Products"
      action={
        <button onClick={() => setForm(empty)} className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          + Add Product
        </button>
      }
    >
      {notice && <button onClick={() => setNotice("")} className="mb-4 w-full rounded-lg bg-blue-50 p-3 text-left text-sm text-blue-800">{notice} ×</button>}
      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
        <label className="mb-1 block text-sm font-medium text-slate-700">Content Type</label>
        <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All products and machinery</option>
          {PRODUCT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      {loading ? (
        <TableSkeleton />
      ) : visibleItems.length === 0 ? (
        <EmptyState icon="📦" title="No records found" text="Add content in this category or change the filter." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Active</th><th className="p-3">Actions</th></tr>
            </thead>
            <tbody>
              {visibleItems.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      { }
                      <img src={p.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                      <span className="font-medium text-ink">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">{p.category}</td>
                  <td className="p-3">{p.active ? "✅" : "—"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => setForm(toForm(p))} className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold hover:bg-slate-200">Edit</button>
                      <button onClick={() => remove(p.id)} className="rounded bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit Product" : "Add Product"}>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name"><input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Slug (optional)"><input className={inputCls} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from name" /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {PRODUCT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Main Image URL">
                <div className="flex gap-2">
                  <input className={inputCls} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                  <label className="cursor-pointer whitespace-nowrap rounded-md border px-3 py-2 text-xs font-semibold">Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => uploadTo("main", e.target.files)} /></label>
                </div>
              </Field>
            </div>
            {form.imageUrl && <img src={form.imageUrl} alt="Main preview" className="h-32 w-full rounded-lg object-cover" />}
            <Field label="Short Description"><input required className={inputCls} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></Field>
            <Field label="Full Description"><textarea required rows={3} className={inputCls} value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} /></Field>
            <Field label="Applications (comma separated)"><input className={inputCls} value={form.applications} onChange={(e) => setForm({ ...form, applications: e.target.value })} /></Field>
            <Field label="Specifications (comma separated)"><input className={inputCls} value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} /></Field>
            <Field label="Features (comma separated)"><input className={inputCls} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></Field>

            <Field label="Product Photo Gallery (one image URL per line)">
              <div className="mb-2 flex gap-2">
                <label className="cursor-pointer rounded-md border px-3 py-2 text-xs font-semibold">Upload Photos<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadTo("gallery", e.target.files)} /></label>
                <span className="self-center text-xs text-slate-400">You can also paste image URLs below.</span>
              </div>
              <textarea rows={3} className={inputCls} value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} placeholder="https://.../photo-1.jpg&#10;https://.../photo-2.jpg" />
              {form.gallery.trim() && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.gallery.split(/[\n,]/).map((u) => u.trim()).filter(Boolean).map((u, i) => (
                    <img key={i} src={u} alt="" className="h-14 w-16 rounded object-cover" />
                  ))}
                </div>
              )}
            </Field>
            <Field label="Product Video URL (MP4/WebM link — shown in gallery)">
              <input className={inputCls} value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://.../product-demo.mp4" />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Sort Order"><input type="number" className={inputCls} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></Field>
              <label className="mt-7 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active
              </label>
            </div>
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
