import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHeading, CTASection, Card } from "@/components/ui";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/motion/Motion";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MSNSS – M S HVAC Engineers is a MS & SS HVAC duct manufacturer, fabricator and installer in Vasai with 25+ years of promoter experience and 2,000 SQM monthly capacity.",
};

const VALUES = [
  ["Quality First", "We build quality into every stage — not just the final check.", "✓"],
  ["On-Time Delivery", "We plan and dispatch to meet your project timelines.", "◷"],
  ["Long-Term Trust", "We build long-term partnerships with our clients.", "◎"],
  ["Complete Support", "Manufacturing, coating, accessories and site installation.", "◆"],
];

const STORY = [
  ["25+ Years", "Promoter Experience", "Decades of hands-on HVAC ducting and fabrication expertise behind every project."],
  ["2023", "MSNSS Established", "The MSNSS brand was formed to deliver complete MS & SS ducting under one roof."],
  ["2,000 SQM", "Monthly Capacity", "A modern Vasai plant producing up to 2,000 SQM of ducting every month."],
  ["End-to-End", "One Team", "From drawing coordination to dispatch and site installation."],
];

const TRUST = [
  ["Approved Standards", "Processes aligned with SMACNA, DW 144 and IS 655 references."],
  ["Skilled Workforce", "Experienced fabricators, welders, finishers and site teams."],
  ["Modern Facility", "Dedicated production plant in Vasai, Maharashtra."],
  ["Responsive Team", "Clear communication and dependable project execution."],
];

const COLLAB = [
  ["/images/about.jpg", "MSNSS engineering team reviewing duct fabrication drawings"],
  ["/images/factory.jpg", "Inside the MSNSS manufacturing facility"],
  ["/images/hero-2.jpg", "Precision MS & SS duct fabrication in progress"],
  ["/images/hero-3.jpg", "On-site HVAC duct installation by MSNSS"],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About MSNSS" subtitle="Engineering better airflow through better ducting." crumb="About Us" />

      {/* Who we are */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <Reveal className="zoom-frame overflow-hidden rounded-2xl shadow-lg">
            { }
            <img src="/images/about.jpg" alt="About MSNSS – M S HVAC Engineers" className="h-full w-full object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="text-sm font-bold uppercase tracking-wider text-brand">Who We Are</span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink">MS &amp; SS HVAC Ducting — Made, Fabricated and Installed</h2>
            <p className="mt-4 text-slate-600">
              MSNSS – M S HVAC Engineers makes quality MS and SS HVAC ducting and related fabrication solutions. We work
              from Vasai, Maharashtra, and operate under M/s. Sun Plast And Pack Machines.
            </p>
            <p className="mt-3 text-slate-600">
              We serve commercial, industrial, hospitality, healthcare and infrastructure projects. From drawing
              coordination and manufacturing to finishing, dispatch and site installation, we handle your full ducting
              need with care.
            </p>
            <p className="mt-3 text-slate-600">
              Our promoter brings more than 25 years of manufacturing experience, and our plant can produce up to
              2,000 SQM of ducting each month.
            </p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
              Work With Us →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Our story timeline */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Our Story" title="Built on Experience. Driven by Precision." subtitle="From decades of manufacturing expertise to a complete in-house ducting brand." />
          <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STORY.map(([big, label, desc]) => (
              <StaggerItem key={label}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg">
                  <div className="text-2xl font-extrabold text-brand">{big}</div>
                  <div className="mt-1 text-sm font-bold text-ink">{label}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Collaboration gallery */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="How We Work" title="Collaboration at Every Stage" subtitle="Our team works closely with consultants, contractors and project teams — from drawing to installation." />
          <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COLLAB.map(([src, alt]) => (
              <StaggerItem key={src}>
                <div className="zoom-frame group relative h-56 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                  { }
                  <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <p className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">{alt}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Trust section */}
      <section className="relative overflow-hidden bg-slate-900 py-16 text-white">
        <div className="absolute inset-0 eng-grid-dark opacity-25" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="text-sm font-bold uppercase tracking-wider text-cyan-300">Why Trust MSNSS</span>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">A Partner You Can Rely On</h2>
              <p className="mt-4 max-w-lg text-slate-300">
                Project teams choose MSNSS for dependable manufacturing, honest communication and complete ducting
                support — backed by real facility capability and experienced people.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {TRUST.map(([t, d]) => (
                  <div key={t} className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/20 text-cyan-300">✓</span>
                    <div>
                      <h3 className="text-sm font-bold">{t}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1} className="zoom-frame overflow-hidden rounded-2xl shadow-2xl">
              { }
              <img src="/images/hero-1.jpg" alt="MSNSS HVAC ducting quality and trust" className="h-full w-full object-cover" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Our Values" title="What We Stand For" />
          <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(([t, d, icon]) => (
              <StaggerItem key={t}>
                <Card className="h-full">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-xl text-brand">{icon}</div>
                  <h3 className="mt-3 text-lg font-bold text-ink">{t}</h3>
                  <p className="mt-2 text-sm text-slate-600">{d}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Visit us */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <SectionHeading eyebrow="Visit Us" title="Our Manufacturing Plant" subtitle={SITE.address} />
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8">
            <p className="text-slate-600">
              We welcome project teams to discuss drawings and requirements. Reach us at{" "}
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="font-semibold text-brand">WhatsApp {SITE.phones[0]}</a>{" "}
              or{" "}
              <a href={`mailto:${SITE.emails[0]}`} className="font-semibold text-brand">{SITE.emails[0]}</a>.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
