import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <Logo />
      <h1 className="mt-8 text-6xl font-extrabold text-brand">404</h1>
      <p className="mt-2 text-xl font-bold text-ink">Page Not Found</p>
      <p className="mt-2 text-slate-500">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}
