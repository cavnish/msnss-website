"use client";
import Link from "next/link";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
      <div className="text-4xl">⚠</div>
      <h1 className="mt-4 text-xl font-extrabold text-ink">The dashboard could not load</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        A temporary error occurred while loading admin data. Please try again.
        {error?.digest ? ` (ref: ${error.digest})` : ""}
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={reset} className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Try Again</button>
        <Link href="/admin/login" className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold">Back to Login</Link>
      </div>
    </div>
  );
}
