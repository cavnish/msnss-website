import { pgTable, serial, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(), email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(), name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(), title: text("title").notNull(), subtitle: text("subtitle").notNull(),
  supportingLine: text("supporting_line"), imageUrl: text("image_url").notNull(), videoUrl: text("video_url"),
  primaryCtaLabel: varchar("primary_cta_label", { length: 120 }), primaryCtaLink: varchar("primary_cta_link", { length: 255 }),
  secondaryCtaLabel: varchar("secondary_cta_label", { length: 120 }), secondaryCtaLink: varchar("secondary_cta_link", { length: 255 }),
  sortOrder: integer("sort_order").default(0).notNull(), active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(), slug: varchar("slug", { length: 255 }).notNull().unique(), name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(), shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(), imageUrl: text("image_url").notNull(),
  applications: jsonb("applications").$type<string[]>().default([]).notNull(), specifications: jsonb("specifications").$type<string[]>().default([]).notNull(),
  features: jsonb("features").$type<string[]>().default([]).notNull(), sortOrder: integer("sort_order").default(0).notNull(),
  gallery: jsonb("gallery").$type<string[]>().default([]).notNull(), videoUrl: text("video_url"),
  active: boolean("active").default(true).notNull(), createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(), slug: varchar("slug", { length: 255 }).notNull().unique(), name: varchar("name", { length: 255 }).notNull(),
  logoUrl: text("logo_url").notNull(), logoAlt: text("logo_alt"), websiteUrl: text("website_url"),
  industry: varchar("industry", { length: 160 }), location: varchar("location", { length: 255 }),
  row: integer("row").default(1).notNull(), workSummary: text("work_summary").notNull(),
  description: text("description"), servicesProvided: jsonb("services_provided").$type<string[]>().default([]).notNull(),
  projectDetails: text("project_details").notNull(), sortOrder: integer("sort_order").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(), active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(), updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(), clientId: integer("client_id").references(() => clients.id, { onDelete: "set null" }),
  slug: varchar("slug", { length: 255 }).notNull().unique(), name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(), region: varchar("region", { length: 80 }),
  category: varchar("category", { length: 120 }).notNull(), industry: varchar("industry", { length: 160 }),
  year: integer("year"), status: varchar("status", { length: 40 }).notNull(),
  shortDescription: text("short_description"), scopeOfWork: text("scope_of_work").notNull(), description: text("description").notNull(),
  imageUrl: text("image_url").notNull(), videoUrl: text("video_url"), servicesUsed: jsonb("services_used").$type<string[]>().default([]).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(), featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(true).notNull(), createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectImages = pgTable("project_images", {
  id: serial("id").primaryKey(), projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(), title: varchar("title", { length: 255 }), altText: text("alt_text").notNull(),
  description: text("description"), sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(), slug: varchar("slug", { length: 255 }).notNull().unique(), name: varchar("name", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 20 }).default("").notNull(), shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(), sortOrder: integer("sort_order").default(0).notNull(),
  imageUrl: text("image_url"), gallery: jsonb("gallery").$type<string[]>().default([]).notNull(),
  videoUrl: text("video_url"), highlights: jsonb("highlights").$type<string[]>().default([]).notNull(),
  active: boolean("active").default(true).notNull(), createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(), name: varchar("name", { length: 255 }).notNull(), email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 60 }).notNull(), company: varchar("company", { length: 255 }), city: varchar("city", { length: 160 }),
  subject: varchar("subject", { length: 255 }), productInterest: varchar("product_interest", { length: 255 }),
  solutionInterest: varchar("solution_interest", { length: 255 }), projectType: varchar("project_type", { length: 160 }),
  projectLocation: varchar("project_location", { length: 255 }), quantity: varchar("quantity", { length: 160 }), message: text("message").notNull(),
  consent: boolean("consent").default(false).notNull(), status: varchar("status", { length: 40 }).default("new").notNull(),
  priority: varchar("priority", { length: 20 }).default("normal").notNull(), assignedTo: varchar("assigned_to", { length: 255 }),
  internalNotes: text("internal_notes"), source: varchar("source", { length: 80 }).default("website").notNull(),
  archived: boolean("archived").default(false).notNull(), createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const inquiryNotes = pgTable("inquiry_notes", {
  id: serial("id").primaryKey(), inquiryId: integer("inquiry_id").notNull().references(() => inquiries.id, { onDelete: "cascade" }),
  note: text("note").notNull(), createdBy: integer("created_by").references(() => adminUsers.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const catalogues = pgTable("catalogues", {
  id: serial("id").primaryKey(), title: varchar("title", { length: 255 }).notNull(), description: text("description"),
  fileUrl: text("file_url").notNull(), fileName: varchar("file_name", { length: 255 }).notNull(),
  active: boolean("active").default(false).notNull(), downloadCount: integer("download_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(), updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const catalogueLeads = pgTable("catalogue_leads", {
  id: serial("id").primaryKey(), catalogueId: integer("catalogue_id").references(() => catalogues.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(), company: varchar("company", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(), phone: varchar("phone", { length: 60 }).notNull(),
  source: varchar("source", { length: 80 }).default("catalogue").notNull(), createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 160 }),
  company: varchar("company", { length: 255 }),
  content: text("content").notNull(),
  rating: integer("rating").default(5).notNull(),
  accentColor: varchar("accent_color", { length: 20 }).default("#0e7cc4").notNull(),
  timeAgo: varchar("time_ago", { length: 80 }),
  verified: boolean("verified").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", { key: varchar("key", { length: 120 }).primaryKey(), value: text("value").notNull() });

export type Product = typeof products.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectImage = typeof projectImages.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Service = typeof services.$inferSelect;
export type HeroSlide = typeof heroSlides.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type InquiryNote = typeof inquiryNotes.$inferSelect;
export type Catalogue = typeof catalogues.$inferSelect;
export type CatalogueLead = typeof catalogueLeads.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
