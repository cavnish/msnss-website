import type { MetadataRoute } from "next";
import { getProducts, getProjects, getServices, getClients } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://msnss.com";
  const [products, projects, services, clients] = await Promise.all([
    getProducts(),
    getProjects(),
    getServices(),
    getClients(),
  ]);

  const staticPages = [
    "",
    "/about",
    "/products",
    "/solutions",
    "/plant-and-machinery",
    "/projects",
    "/catalogue",
    "/contact",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));

  return [
    ...staticPages,
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: new Date() })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: new Date() })),
    ...services.map((s) => ({ url: `${base}/solutions/${s.slug}`, lastModified: new Date() })),
    ...clients.map((c) => ({ url: `${base}/clients/${c.slug}`, lastModified: c.updatedAt })),
  ];
}
