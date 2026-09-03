import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailHero } from "@/components/DetailHero";
import { MediaShowcase } from "@/components/MediaShowcase";
import { MotionReveal } from "@/components/MotionReveal";
import { CTASection } from "@/components/ui";
import { getProjectPortfolio } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await getProjectPortfolio((await params).slug);
  if (!data) return { title: "Project Not Found" };
  const { project, client } = data;
  const title = [project.name, client?.name, project.location, "MSNSS"].filter(Boolean).join(" | ");
  const description = project.shortDescription || project.description;
  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title, description, images: [{ url: project.imageUrl, alt: `${project.name} – MSNSS project` }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const data = await getProjectPortfolio((await params).slug);
  if (!data) notFound();
  const { project, client, gallery, related } = data;
  const galleryUrls = gallery.map((g) => g.imageUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://msnss.com" },
      { "@type": "ListItem", position: 2, name: "Projects", item: "https://msnss.com/projects" },
      { "@type": "ListItem", position: 3, name: project.name, item: `https://msnss.com/projects/${project.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <DetailHero
        eyebrow="MSNSS Project"
        category={project.category}
        title={project.name}
        subtitle={project.shortDescription || project.description}
        image={project.imageUrl}
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: project.name }]}
        primary={{ label: "Start a Similar Project", href: `/contact?source=project:${project.slug}` }}
        secondary={{ label: "All Projects", href: "/projects" }}
        stats={[
          { label: "Location", value: project.location },
          { label: "Sector", value: project.category },
          { label: "Year", value: project.year ? String(project.year) : "—" },
          { label: "Status", value: project.status },
        ]}
      />

      {/* Overview */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <MotionReveal className="zoom-frame overflow-hidden rounded-2xl border border-slate-200 shadow-md">
            { }
            <img src={project.imageUrl} alt={`${project.name} – MSNSS project`} className="h-full max-h-[420px] w-full object-cover" />
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand"><span className="h-px w-6 bg-brand/50" /> About the Project</span>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{project.name}</h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">{project.description}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-5 text-sm">
              <div><dt className="text-slate-500">Location</dt><dd className="mt-1 font-semibold">{project.location}</dd></div>
              <div><dt className="text-slate-500">Year</dt><dd className="mt-1 font-semibold">{project.year || "Not specified"}</dd></div>
              <div><dt className="text-slate-500">Sector</dt><dd className="mt-1 font-semibold">{project.category}</dd></div>
              <div><dt className="text-slate-500">Client</dt><dd className="mt-1 font-semibold">{client ? <Link href={`/clients/${client.slug}`} className="text-brand">{client.name}</Link> : "Private / not listed"}</dd></div>
            </dl>
          </MotionReveal>
        </div>
      </section>

      {/* Scope + services */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:px-6 lg:grid-cols-2">
          <MotionReveal className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Scope</span>
            <h2 className="mt-2 text-2xl font-bold">MSNSS Scope of Work</h2>
            <p className="mt-3 leading-7 text-slate-600">{project.scopeOfWork}</p>
          </MotionReveal>
          {project.servicesUsed.length > 0 && (
            <MotionReveal delay={0.08} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Services</span>
              <h2 className="mt-2 text-2xl font-bold">Delivered On This Project</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.servicesUsed.map((s) => (
                  <span key={s} className="rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand">{s}</span>
                ))}
              </div>
            </MotionReveal>
          )}
        </div>
      </section>

      {/* Project media: main image + gallery images + project video */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <MotionReveal className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand"><span className="h-px w-6 bg-brand/50" /> Project Media</span>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Photos &amp; Video</h2>
            <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">Real project images and video. Click any tile to view full size.</p>
          </MotionReveal>
          <MediaShowcase mainImage={project.imageUrl} gallery={galleryUrls} videoUrl={project.videoUrl} alt={`${project.name} – MSNSS project`} />
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="bg-slate-50 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <h2 className="mb-7 text-2xl font-bold tracking-tight sm:text-3xl">More Projects</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} href={`/projects/${p.slug}`} className="zoom-frame group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  { }
                  <img src={p.imageUrl} alt={`${p.name} – MSNSS project`} className="h-48 w-full object-cover" />
                  <div className="p-4">
                    <div className="text-xs font-semibold uppercase text-brand">{p.category}</div>
                    <h3 className="mt-1 font-bold group-hover:text-brand">{p.name}</h3>
                    <p className="text-sm text-slate-500">{p.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
