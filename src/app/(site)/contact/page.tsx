import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { InquiryForm } from "@/components/InquiryForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact MSNSS for MS & SS HVAC ducting quotes. Call +91 702 109 4388 or email sales@msnss.com. Plant in Vasai, Palghar, Maharashtra.",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ source?: string; client?: string; project?: string }> }) {
  const query = await searchParams;
  const source = query.project ? `project:${query.project}` : query.client ? `client:${query.client}` : query.source || "contact";
  return (
    <>
      <PageHeader
        title="Contact MSNSS"
        subtitle="Let's discuss your drawings, specifications and production requirements."
        crumb="Contact Us"
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold text-ink">Get in Touch</h2>
            <p className="mt-3 text-slate-600">
              We are ready to help with your HVAC ducting project. Reach us any
              of these ways.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="text-2xl">📍</div>
                <div>
                  <h3 className="font-bold text-ink">Plant Address</h3>
                  <p className="mt-1 text-sm text-slate-600">{SITE.address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">📞</div>
                <div>
                  <h3 className="font-bold text-ink">Phone</h3>
                  {SITE.phones.map((p) => (
                    <p key={p} className="mt-1 text-sm">
                      <a href={`tel:${p.replace(/\s/g, "")}`} className="text-slate-600 hover:text-brand">{p}</a>
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">✉️</div>
                <div>
                  <h3 className="font-bold text-ink">Email</h3>
                  {SITE.emails.map((e) => (
                    <p key={e} className="mt-1 text-sm">
                      <a href={`mailto:${e}`} className="text-slate-600 hover:text-brand">{e}</a>
                    </p>
                  ))}
                </div>
              </div>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                className="inline-flex items-center gap-2 rounded-md bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-ink">Send an Inquiry</h2>
              <p className="mt-1 mb-6 text-sm text-slate-600">
                Fill the form and we&apos;ll get back to you shortly.
              </p>
              <InquiryForm source={source} />
            </div>
          </div>
        </div>
      </section>

      <div className="h-96 w-full">
        <iframe
          title="MSNSS Location"
          src="https://www.google.com/maps?q=Vasai,Palghar,Maharashtra&output=embed"
          className="h-full w-full border-0"
          loading="lazy"
        />
      </div>
    </>
  );
}
