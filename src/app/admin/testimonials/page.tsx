"use client";
import { useEffect, useState } from "react";
import { AdminPage, Modal, Field, inputCls, EmptyState, TableSkeleton } from "@/components/admin/AdminUI";
import type { Testimonial } from "@/db/schema";

type Form = {
  id?: number; name: string; role: string; company: string; content: string;
  rating: number; accentColor: string; timeAgo: string; verified: boolean; sortOrder: number; active: boolean;
};
const empty: Form = { name: "", role: "", company: "", content: "", rating: 5, accentColor: "#0e7cc4", timeAgo: "", verified: true, sortOrder: 0, active: true };
function toForm(t: Testimonial): Form {
  return { id: t.id, name: t.name, role: t.role ?? "", company: t.company ?? "", content: t.content, rating: t.rating, accentColor: t.accentColor, timeAgo: t.timeAgo ?? "", verified: t.verified, sortOrder: t.sortOrder, active: t.active };
}

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    try { const r = await fetch("/api/admin/testimonials"); if (!r.ok) throw new Error("Unable to load"); setItems(await r.json()); }
    catch (e) { setNotice((e as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const url = form.id ? `/api/admin/testimonials/${form.id}` : "/api/admin/testimonials";
    const r = await fetch(url, { method: form.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const j = await r.json();
    setSaving(false);
    if (!r.ok) { setNotice(j.error || "Unable to save."); return; }
    setNotice(`Testimonial ${form.id ? "updated" : "created"} successfully.`);
    setForm(null); load();
  }
  async function remove(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    const r = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (!r.ok) { setNotice("Unable to delete."); return; }
    setItems((p) => p.filter((x) => x.id !== id));
    setNotice("Testimonial deleted.");
  }

  return (
    <AdminPage title="Testimonials" action={<button onClick={() => setForm({ ...empty })} className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">+ Add Testimonial</button>}>
      {notice && <button onClick={() => setNotice("")} className="mb-4 w-full rounded-lg bg-blue-50 p-3 text-left text-sm text-blue-800">{notice} ×</button>}
      {loading ? <TableSkeleton /> : items.length === 0 ? (
        <EmptyState icon="★" title="No testimonials" text="Add your first client review." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-3">Client</th><th className="p-3">Rating</th><th className="p-3">Active</th><th className="p-3">Order</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3"><b>{t.name}</b><div className="text-xs text-slate-500">{t.role}{t.company ? ` · ${t.company}` : ""}</div></td>
                  <td className="p-3 text-brand">{"★".repeat(t.rating)}</td>
                  <td className="p-3">{t.active ? "✅" : "—"}</td>
                  <td className="p-3">{t.sortOrder}</td>
                  <td className="p-3"><div className="flex gap-2">
                    <button onClick={() => setForm(toForm(t))} className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold hover:bg-slate-200">Edit</button>
                    <button onClick={() => remove(t.id)} className="rounded bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100">Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit Testimonial" : "Add Testimonial"}>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client Name"><input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Role / Designation"><input className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Project Manager" /></Field>
              <Field label="Company"><input className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
              <Field label="Time (e.g. 3 months ago)"><input className={inputCls} value={form.timeAgo} onChange={(e) => setForm({ ...form, timeAgo: e.target.value })} /></Field>
            </div>
            <Field label="Review Content"><textarea required rows={4} className={inputCls} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Rating (1-5)"><input type="number" min={1} max={5} className={inputCls} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></Field>
              <Field label="Avatar Color"><input type="color" className="h-10 w-full rounded-md border border-slate-300" value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} /></Field>
              <Field label="Sort Order"><input type="number" className={inputCls} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></Field>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} /> Verified badge</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
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
