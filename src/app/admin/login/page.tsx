"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

function safeNext(): string {
  if (typeof window === "undefined") return "/admin";
  const requested = new URLSearchParams(window.location.search).get("next");
  if (requested && requested.startsWith("/admin") && !requested.startsWith("//")) return requested;
  return "/admin";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Login failed");

      const next = safeNext();
      // Refresh the router cache so the authenticated layout re-renders,
      // then do a full-document navigation which guarantees the freshly set
      // session cookie is sent with the request for /admin.
      router.refresh();
      window.location.replace(next);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(14,124,196,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(14,124,196,.35)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="flex justify-center"><Logo /></div>
        <div className="mt-7 text-center">
          <span className="text-xs font-bold uppercase tracking-[.2em] text-brand">Secure CMS</span>
          <h1 className="mt-2 text-2xl font-extrabold text-ink">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your authorized MSNSS admin credentials.</p>
        </div>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email address</span>
            <input name="email" type="email" autoComplete="username" required className={input} placeholder="admin@company.com" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
            <div className="relative">
              <input name="password" type={show ? "text" : "password"} autoComplete="current-password" required className={`${input} pr-16`} placeholder="Enter password" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-brand">{show ? "Hide" : "Show"}</button>
            </div>
          </label>
          {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In to Dashboard"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">Protected access for authorized MSNSS team members only.</p>
      </div>
    </main>
  );
}
