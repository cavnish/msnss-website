import Link from "next/link";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="rounded-lg bg-white p-3 inline-block">
            <Logo />
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            {SITE.name}. {SITE.tagline}.
          </p>
          <p className="mt-3 text-sm font-semibold text-brand">{SITE.slogan}</p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              ["Home", "/"],
              ["About Us", "/about"],
              ["Products", "/products"],
              ["Solutions", "/solutions"],
              ["Projects", "/projects"],
              ["Catalogue", "/catalogue"],
              ["Contact", "/contact"],
            ].map(([l, h]) => (
              <li key={l}>
                <Link href={h} className="hover:text-brand">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Products
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              "MS Rectangular Duct",
              "SS Rectangular Duct",
              "MS Round Duct",
              "SS Round Duct",
              "Fire Rated Duct",
              "Kitchen Exhaust Duct",
              "Duct Accessories",
            ].map((p) => (
              <li key={p}>
                <Link href="/products" className="hover:text-brand">
                  {p}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Contact
          </h4>
          <p className="text-sm leading-relaxed">{SITE.address}</p>
          <div className="mt-3 space-y-1 text-sm">
            {SITE.phones.map((p) => (
              <div key={p}>
                📞 <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-brand">{p}</a>
              </div>
            ))}
            {SITE.emails.map((e) => (
              <div key={e}>
                ✉️ <a href={`mailto:${e}`} className="hover:text-brand">{e}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs sm:flex-row">
          <span>© {new Date().getFullYear()} MSNSS – M S HVAC Engineers. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-brand">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-brand">Terms &amp; Conditions</Link>
            <Link href="/admin/login" className="text-slate-500 hover:text-brand">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
