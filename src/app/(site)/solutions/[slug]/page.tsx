import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MotionReveal } from "@/components/MotionReveal";
import { MediaGallery } from "@/components/MediaGallery";
import { MediaShowcase } from "@/components/MediaShowcase";
import { DetailHero } from "@/components/DetailHero";
import { CTASection } from "@/components/ui";
import { getServiceBySlug, getServices } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const solution = await getServiceBySlug((await params).slug);
  if (!solution) return { title: "Solution Not Found" };
  const title = `${solution.name} | HVAC Ducting Solutions | MSNSS`;
  return {
    title,
    description: solution.shortDescription,
    alternates: { canonical: `/solutions/${solution.slug}` },
    openGraph: { title, description: solution.shortDescription, type: "website" },
    twitter: { card: "summary", title, description: solution.shortDescription },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const solution = await getServiceBySlug((await params).slug);
  if (!solution) notFound();
  const all = await getServices();
  const related = all.filter((item) => item.id !== solution.id).slice(0, 6);
  const heroImage = solution.imageUrl || "/images/factory.jpg";

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "Service", name: solution.name, description: solution.shortDescription, provider: { "@type": "Organization", name: "MSNSS – M S HVAC Engineers", url: "https://msnss.com" }, areaServed: { "@type": "Country", name: "India" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: "https://msnss.com" }, { "@type": "ListItem", position: 2, name: "Solutions", item: "https://msnss.com/solutions" }, { "@type": "ListItem", position: 3, name: solution.name, item: `https://msnss.com/solutions/${solution.slug}` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [ { "@type": "Question", name: `What does MSNSS provide for ${solution.name}?`, acceptedAnswer: { "@type": "Answer", text: solution.fullDescription } }, { "@type": "Question", name: `How can I discuss a ${solution.name} requirement?`, acceptedAnswer: { "@type": "Answer", text: "Share the project drawings, location and required scope with MSNSS. The team will review the information before confirming the work." } } ] },
  ];

  const highlights = solution.highlights?.length ? solution.highlights : ["Drawing-based execution", "MS & SS material options", "In-house finishing", "Site coordination"];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <DetailHero
        eyebrow={`${solution.icon || "◇"} MSNSS Solution`}
        title={solution.name}
        subtitle={solution.shortDescription}
        image={heroImage}
        crumbs={[{ label: "Home", href: "/" }, { label: "Solutions", href: "/solutions" }, { label: solution.name }]}
        primary={{ label: "Request a Quote", href: `/contact?source=solution:${solution.slug}` }}
        secondary={{ label: "Get Our Catalogue", href: "/catalogue" }}
        stats={[
          { label: "Approach", value: "Drawing-based" },
          { label: "Material", value: "MS & SS" },
          { label: "Finishing", value: "In-house" },
          { label: "Support", value: "On-site" },
        ]}
      />

      {/* Overview + media */}
      <section className="relative overflow-hidden bg-white py-14 sm:py-16">
        <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-start gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <MotionReveal>
            <MediaGallery mainImage={heroImage} gallery={solution.gallery} videoUrl={solution.videoUrl} alt={`${solution.name} by MSNSS`} />
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand"><span className="h-px w-6 bg-brand/50" /> Solution Overview</span>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">What MSNSS Provides</h2>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">{solution.fullDescription}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold"><span className="mr-2 text-brand">✓</span>{item}</div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/contact?source=solution:${solution.slug}`} className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark">Request a Quote</Link>
              <Link href="/catalogue" className="rounded-lg border-2 border-brand px-6 py-3 text-sm font-semibold text-brand hover:bg-brand hover:text-white">Get Our Catalogue</Link>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <MotionReveal className="mb-8">
            <span className="text-xs font-bold uppercase tracking-[.18em] text-brand">How We Work</span>
            <h2 className="mt-2 text-3xl font-extrabold">A Clear Path From Requirement to Delivery</h2>
          </MotionReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[["01", "Requirement", "Review drawings, specifications and site needs."], ["02", "Planning", "Material coordination and fabrication scheduling."], ["03", "Execution", "Precise fabrication, finishing and quality checks."], ["04", "Delivery", "Safe dispatch and coordinated site installation."]].map(([n, t, d]) => (
              <MotionReveal key={n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-2xl font-extrabold text-brand">{n}</div>
                <h3 className="mt-2 font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{d}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Media — modern gallery grid */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <MotionReveal className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
              <span className="h-px w-6 bg-brand/50" /> Solution Media
            </span>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Photos &amp; Video</h2>
            <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              Fabrication, finishing and site execution media. Click any tile to view full size.
            </p>
          </MotionReveal>
          <MediaShowcase mainImage={heroImage} gallery={solution.gallery} videoUrl={solution.videoUrl} alt={`${solution.name} by MSNSS`} />
        </div>
      </section>

      {/* Related + CTA panel */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-3">
          <MotionReveal className="lg:col-span-2 rounded-2xl bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-extrabold">Discuss Your {solution.name} Requirement</h2>
            <p className="mt-2 max-w-lg leading-7 text-slate-300">Share your drawings, project location and required scope. Our team will review the information and respond.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/contact?source=solution:${solution.slug}`} className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold">Request a Quote</Link>
              <Link href="/projects" className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold">View Projects</Link>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.1} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <span className="text-xs font-bold uppercase tracking-wide text-brand">Related Solutions</span>
            <div className="mt-4 space-y-2">
              {related.map((item) => (
                <Link key={item.id} href={`/solutions/${item.slug}`} className="group flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:translate-x-1 hover:text-brand">
                  <span>{item.name}</span><span>→</span>
                </Link>
              ))}
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* FAQ just before footer */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <MotionReveal>
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-brand">Quick Answers</span>
              <h2 className="mt-2 text-3xl font-extrabold">Questions About {solution.name}</h2>
            </div>
            <div className="mt-8 space-y-3">
              <details open className="rounded-xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer font-bold">What does MSNSS provide for {solution.name}?</summary>
                <p className="mt-3 leading-7 text-slate-600">{solution.fullDescription}</p>
              </details>
              <details className="rounded-xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer font-bold">How do I request this solution?</summary>
                <p className="mt-3 leading-7 text-slate-600">Send the project drawings, location and required scope through the inquiry form. MSNSS will review the information before confirming the work.</p>
              </details>
            </div>
          </MotionReveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
