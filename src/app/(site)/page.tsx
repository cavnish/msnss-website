import Link from "next/link";
import { HeroPremium } from "@/components/HeroPremium";
import { AboutSection } from "@/components/AboutSection";
import { SolutionsShowcase } from "@/components/SolutionsShowcase";
import { InquiryForm } from "@/components/InquiryForm";
import { Testimonials } from "@/components/Testimonials";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/motion/Motion";
import { SITE } from "@/lib/site";
import { ProductCard } from "@/components/ProductCard";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { SectionHeading, CTASection, Card } from "@/components/ui";
import {
  getHeroSlides,
  getProducts,
  getProjects,
  getClients,
  getServices,
  getTestimonials,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

const WHY = [
  ["Precision Manufacturing", "Accurate fabrication made to your approved drawings.", "🎯"],
  ["Experienced Team", "Backed by 25+ years of promoter experience.", "👷"],
  ["Production Capability", "Up to 2,000 SQM of MS & SS ducting per month.", "🏭"],
  ["Project Responsiveness", "Fast coordination and timely replies throughout.", "⚡"],
  ["Complete Ducting Support", "Manufacturing, accessories and installation in one place.", "🔗"],
  ["Quality-Focused Execution", "Careful attention to finishing and delivery.", "✅"],
];

const STANDARDS = ["SMACNA", "DW 144", "IS 655"];

const INDUSTRIES = [
  ["🏢", "Commercial"],
  ["🏨", "Hotels & Hospitality"],
  ["🏥", "Healthcare"],
  ["🍽️", "Commercial Kitchens"],
  ["🏭", "Industrial"],
  ["✈️", "Aviation"],
  ["🏦", "Corporate & Banking"],
  ["🏗️", "Infrastructure"],
];

const WORKFLOW = [
  ["01", "Understand", "Drawings, specs and application needs."],
  ["02", "Plan", "Production planning and material coordination."],
  ["03", "Manufacture", "Precision cutting, forming and joining."],
  ["04", "Inspect", "Dimensional and visual quality checks."],
  ["05", "Finish", "Painting, coating and insulation."],
  ["06", "Deliver & Install", "Safe dispatch and site installation."],
];

export default async function HomePage() {
  const [slides, products, projects, clients, services, testimonials] = await Promise.all([
    getHeroSlides(),
    getProducts(),
    getProjects(),
    getClients(),
    getServices(),
    getTestimonials(),
  ]);

  const featuredProducts = products.filter((p) => p.category === "Product").slice(0, 8);

  return (
    <>
      <HeroPremium slides={slides} />

      {/* About */}
      <AboutSection />

      {/* Why MSNSS */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Why Us" title="Why Project Teams Choose MSNSS" />
          <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map(([t, d, icon]) => (
              <StaggerItem key={t} className="h-full">
                <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-xl">
                  <div className="text-3xl transition group-hover:scale-110">{icon}</div>
                  <h3 className="mt-3 text-lg font-bold text-ink group-hover:text-brand">{t}</h3>
                  <p className="mt-2 text-sm text-slate-600">{d}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Products */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Products"
            title="Our Ducting Products"
            subtitle="Made for efficient airflow, durability and dependable performance."
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex rounded-md border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Manufacturing facility */}
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <Reveal className="group overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
            { }
            <img src="/images/factory.jpg" alt="Inside the MSNSS manufacturing facility" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="text-sm font-bold uppercase tracking-wider text-brand">
              Plant &amp; Machinery
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
              Inside the MSNSS Manufacturing Facility
            </h2>
            <p className="mt-4 text-slate-600">
              Manufacturing is where quality begins. Our plant is fitted with
              machines for accurate duct forming, cutting, bending, punching,
              welding and finishing.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700">
              {[
                "Plasma Cutting Machine",
                "Flange & Hole Press",
                "Bending & Punching",
                "Gas Welding",
                "Spray Painting",
                "Finished Duct Storage",
              ].map((m) => (
                <div key={m} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="text-brand">▪</span> {m}
                </div>
              ))}
            </div>
            <Link href="/plant-and-machinery" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
              Explore Plant &amp; Machinery →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Solutions */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Solutions"
            title="HVAC Solutions Built Around Your Project"
            subtitle="From fabrication to final installation, MSNSS supports your full ducting need."
          />
          <SolutionsShowcase services={services} />
          <div className="mt-10 text-center">
            <Link href="/solutions" className="inline-flex rounded-lg border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white">
              View All Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Quality & Standards"
            title="Manufactured to Recognized Standards"
            subtitle="Our processes are aligned with applicable ducting standards and project specifications."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {STANDARDS.map((s) => (
              <div
                key={s}
                className="rounded-xl border-2 border-brand bg-white p-10 text-center shadow-sm"
              >
                <div className="text-3xl font-extrabold text-brand">{s}</div>
                <div className="mt-2 text-sm text-slate-600">Manufacturing Standard</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fire rated */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <Reveal className="group overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
            { }
            <img src="/images/fire-rated.jpg" alt="MSNSS fire-rated ducting solutions" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="text-sm font-bold uppercase tracking-wider text-brand">
              Fire-Rated Solutions
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
              Fire Protection for Critical Ducting Applications
            </h2>
            <p className="mt-4 text-slate-600">
              For areas that need extra fire and heat resistance, MSNSS provides
              fire-rated ducting using suitable coating systems.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Smoke Exhaust",
                "Kitchen Exhaust",
                "Car Park Ventilation",
                "Pressurization",
                "Industrial Exhaust",
              ].map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-700"
                >
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Industries"
            title="Ducting Solutions Across Critical Applications"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {INDUSTRIES.map(([icon, label]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:border-brand hover:shadow-sm"
              >
                <div className="text-4xl">{icon}</div>
                <div className="mt-3 text-sm font-semibold text-ink">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Projects"
            title="Projects That Speak for Our Work"
          />
          <ProjectShowcase projects={projects} clients={clients} />
          <div className="mt-10 text-center">
            <Link href="/projects" className="inline-flex rounded-md border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Our Process"
            title="How We Execute Your Ducting Requirement"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WORKFLOW.map(([n, t, d]) => (
              <div key={n} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-2xl font-extrabold text-brand">{n}</div>
                <h3 className="mt-2 text-lg font-bold text-ink">{t}</h3>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials items={testimonials} />

      {/* Final quote CTA — reference-style navy panel with form */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="relative p-8 sm:p-12">
                <div className="absolute inset-0 eng-grid-dark opacity-30" />
                <div className="relative">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Request a Quote</span>
                  <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Let&apos;s Discuss Your Project</h2>
                  <p className="mt-4 max-w-md text-slate-300">
                    Share your drawings, specifications and production requirements.
                    Our team will review your needs and get back to you quickly.
                  </p>
                  <div className="mt-8 space-y-4 text-sm">
                    <a href={`tel:${SITE.phones[0].replace(/\s/g, "")}`} className="flex items-center gap-3 text-slate-200 hover:text-white">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20 text-cyan-300">☎</span>
                      {SITE.phones[0]}
                    </a>
                    <a href={`mailto:${SITE.emails[0]}`} className="flex items-center gap-3 text-slate-200 hover:text-white">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20 text-cyan-300">✉</span>
                      {SITE.emails[0]}
                    </a>
                    <div className="flex items-start gap-3 text-slate-300">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-cyan-300">◎</span>
                      <span>{SITE.address}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 sm:p-10">
                <InquiryForm source="homepage" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
