import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, CTASection } from "@/components/ui";
import { getProducts } from "@/lib/queries";
import { PRODUCT_CATEGORIES } from "@/lib/site";
import { CatalogueDownload } from "@/components/CatalogueDownload";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Browse the full MSNSS product catalogue — MS & SS ducting, accessories, fire-rated coatings and plant machinery.",
};

export const dynamic = "force-dynamic";

export default async function CataloguePage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader
        title="Product Catalogue"
        subtitle="A complete list of MSNSS ducting products and solutions."
        crumb="Catalogue"
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl space-y-14 px-6">
          {PRODUCT_CATEGORIES.map((cat) => {
            const items = products.filter((p) => p.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat}>
                <h2 className="mb-6 border-l-4 border-brand pl-3 text-2xl font-extrabold text-ink">
                  {cat}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand hover:shadow-md"
                    >
                      { }
                      <img src={p.imageUrl} alt={p.name} className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />
                      <div>
                        <h3 className="font-bold text-ink">{p.name}</h3>
                        <p className="text-sm text-slate-500 line-clamp-1">{p.shortDescription}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          <CatalogueDownload />
        </div>
      </section>
      <CTASection />
    </>
  );
}
