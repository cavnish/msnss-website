import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MotionReveal } from "@/components/MotionReveal";
import { MediaGallery } from "@/components/MediaGallery";
import { MediaShowcase } from "@/components/MediaShowcase";
import { RelatedProductsMotion } from "@/components/RelatedProductsMotion";
import { DetailHero } from "@/components/DetailHero";
import { CTASection } from "@/components/ui";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return { title: "Product Not Found" };
  const title = `${product.name} | HVAC Ducting Product | MSNSS`;
  return {
    title,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title, description: product.shortDescription, images: [{ url: product.imageUrl, alt: `${product.name} manufactured by MSNSS` }] },
    twitter: { card: "summary_large_image", title, description: product.shortDescription, images: [product.imageUrl] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  const allRelated = await getProducts(product.category);
  const related = allRelated.filter((item) => item.id !== product.id);
  const applicationAnswer = product.applications.length
    ? `${product.name} can be considered for ${product.applications.join(", ")}, subject to approved project requirements.`
    : `Applications for ${product.name} are confirmed against the project drawings and required scope.`;

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "Product", name: product.name, image: [product.imageUrl], description: product.shortDescription, category: product.category, brand: { "@type": "Brand", name: "MSNSS" }, manufacturer: { "@type": "Organization", name: "MSNSS – M S HVAC Engineers" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: "https://msnss.com" }, { "@type": "ListItem", position: 2, name: "Products", item: "https://msnss.com/products" }, { "@type": "ListItem", position: 3, name: product.name, item: `https://msnss.com/products/${product.slug}` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [ { "@type": "Question", name: `What is ${product.name}?`, acceptedAnswer: { "@type": "Answer", text: product.fullDescription } }, { "@type": "Question", name: `Where is ${product.name} used?`, acceptedAnswer: { "@type": "Answer", text: applicationAnswer } } ] },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <DetailHero
        eyebrow="MSNSS Product"
        category={product.category}
        title={product.name}
        subtitle={product.shortDescription}
        image={product.imageUrl}
        crumbs={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: product.name }]}
        primary={{ label: "Request a Quote", href: `/contact?source=product:${product.slug}` }}
        secondary={{ label: "Get Our Catalogue", href: "/catalogue" }}
        stats={[
          { label: "Material", value: "MS & SS" },
          { label: "Made To", value: "Drawings" },
          { label: "Finishing", value: "In-house" },
          { label: "Install", value: "On-site" },
        ]}
      />

      {/* Overview with media gallery */}
      <section className="relative overflow-hidden bg-white py-14 sm:py-16">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-brand-light/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-start gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <MotionReveal>
            <MediaGallery mainImage={product.imageUrl} gallery={product.gallery} videoUrl={product.videoUrl} alt={`${product.name} manufactured by MSNSS`} />
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand"><span className="h-px w-6 bg-brand/50" /> Product Overview</span>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Designed Around Your Requirement</h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">{product.fullDescription}</p>
            {product.features.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <div key={feature} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold"><span className="mr-2 text-brand">✓</span>{feature}</div>
                ))}
              </div>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/contact?source=product:${product.slug}`} className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark">Request a Quote</Link>
              <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hello MSNSS, I would like to discuss ${product.name}.`)}`} className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold transition hover:border-brand hover:text-brand">WhatsApp</a>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* Detailed content: applications + specifications + why choose */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-3">
          <MotionReveal className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[.16em] text-brand">Applications</span>
            <h2 className="mt-2 text-2xl font-extrabold">Where It Is Used</h2>
            {product.applications.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {product.applications.map((item) => (
                  <li key={item} className="flex items-start gap-2 border-l-2 border-brand pl-3 text-sm text-slate-600">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-slate-500">Applications are confirmed against your project drawings and required scope.</p>
            )}
          </MotionReveal>

          <MotionReveal delay={0.06} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[.16em] text-brand">Specifications</span>
            <h2 className="mt-2 text-2xl font-extrabold">Technical Information</h2>
            {product.specifications.length > 0 ? (
              <dl className="mt-5 divide-y divide-slate-100">
                {product.specifications.map((item) => (
                  <div key={item} className="py-3 text-sm text-slate-600">{item}</div>
                ))}
              </dl>
            ) : (
              <p className="mt-5 text-sm text-slate-500">Material, thickness, finish and dimensions are confirmed during quotation.</p>
            )}
          </MotionReveal>

          <MotionReveal delay={0.12} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[.16em] text-brand">Why MSNSS</span>
            <h2 className="mt-2 text-2xl font-extrabold">Manufactured with Care</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2"><span className="text-brand">▪</span> Fabricated to approved project drawings</li>
              <li className="flex gap-2"><span className="text-brand">▪</span> MS &amp; SS material options</li>
              <li className="flex gap-2"><span className="text-brand">▪</span> In-house finishing and quality checks</li>
              <li className="flex gap-2"><span className="text-brand">▪</span> Dispatch and site installation support</li>
            </ul>
          </MotionReveal>
        </div>
      </section>

      {/* Product Media — modern gallery grid */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <MotionReveal className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
              <span className="h-px w-6 bg-brand/50" /> Product Media
            </span>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Photos &amp; Video</h2>
            <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              Real product, fabrication and installation media. Click any tile to view full size.
            </p>
          </MotionReveal>
          <MediaShowcase mainImage={product.imageUrl} gallery={product.gallery} videoUrl={product.videoUrl} alt={`${product.name} by MSNSS`} />
        </div>
      </section>

      {/* Related products motion carousel */}
      {related.length > 0 && (
        <section className="overflow-hidden bg-slate-50 py-16">
          <div className="mx-auto mb-8 max-w-7xl px-6">
            <span className="text-xs font-bold uppercase tracking-[.18em] text-brand">Explore More</span>
            <h2 className="mt-2 text-3xl font-extrabold">Related Products</h2>
            <p className="mt-2 text-slate-600">More MS &amp; SS ducting products from our range.</p>
          </div>
          <RelatedProductsMotion products={related} />
        </section>
      )}

      {/* FAQ moved just before footer */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <MotionReveal>
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-brand">Quick Answers</span>
              <h2 className="mt-2 text-3xl font-extrabold">Common Product Questions</h2>
            </div>
            <div className="mt-8 space-y-3">
              <details className="rounded-xl border border-slate-200 bg-white p-5" open>
                <summary className="cursor-pointer font-bold">What is {product.name}?</summary>
                <p className="mt-3 leading-7 text-slate-600">{product.fullDescription}</p>
              </details>
              <details className="rounded-xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer font-bold">Where is {product.name} used?</summary>
                <p className="mt-3 leading-7 text-slate-600">{applicationAnswer}</p>
              </details>
              <details className="rounded-xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer font-bold">How can I request project-specific details?</summary>
                <p className="mt-3 leading-7 text-slate-600">Send your drawings, location and required scope through the inquiry form. MSNSS will review the available information before confirming materials, dimensions or finishing.</p>
              </details>
            </div>
          </MotionReveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
