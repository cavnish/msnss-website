# MSNSS – M S HVAC Engineers

Production B2B website and CMS for MSNSS: MS & SS HVAC duct manufacturing, fabrication and installation. Built on Next.js (App Router) with a database-driven CMS, secure admin, media uploads, catalogue leads and email notifications.

## Overview

- Public marketing site (products, solutions, projects, clients, catalogue, contact) driven entirely by a PostgreSQL CMS.
- Secure admin dashboard with full CRUD for every content type.
- Quote/inquiry pipeline with validation, rate limiting, database persistence and Resend email (fail-safe).
- Media uploads (images/video/PDF) via Supabase Storage, with a local-disk fallback for development.

## Features

- CMS-managed hero slider, products, solutions/services, plant & machinery, projects, project galleries, clients, testimonials, catalogue.
- Product/solution/project detail pages with cinematic hero, media galleries (image + video + lightbox), FAQ and structured data.
- Trusted-clients marquee, testimonials carousel, inquiry form with reference numbers.
- SEO: per-page metadata, canonical URLs, dynamic sitemap, robots, Organization/Product/Service/Breadcrumb/FAQ JSON-LD.
- Admin: search/filter, publish/unpublish, ordering, safe delete/deactivate, inquiry status/priority/notes.

## Technology Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, Framer Motion
- PostgreSQL / Supabase PostgreSQL, Drizzle ORM
- Supabase Storage (server-only service role) with local-disk dev fallback
- Resend email
- Auth: `jose` JWT in HTTP-only cookies, `bcryptjs` password hashing, `zod` validation

This is a **Next.js Node server application** — not a static export, SPA, or Express app. Do not deploy it as static HTML.

## Project Structure

```text
src/app/(site)/        Public pages
src/app/admin/         Protected admin CMS
src/app/api/           Route handlers (public + authenticated)
src/components/        UI, motion, media, admin components
src/db/schema.ts       Drizzle schema (source of truth)
src/lib/auth.ts        JWT sessions + password hashing
src/lib/storage.ts     Supabase Storage + local fallback
src/lib/mailer.ts      Resend integration (server only)
src/lib/queries.ts     Public data queries
src/proxy.ts           Edge redirects + admin guard
render.yaml            Render Web Service config
.env.example           Environment variable reference
```

## Requirements

- Node.js 20+
- PostgreSQL 15+ (or Supabase PostgreSQL)
- (Recommended) Supabase project for Storage
- (For email) Resend account with a verified domain

## Local Development

Prerequisites: **Node.js 20+** and a **PostgreSQL 15+** database (local or Supabase).

### 1. Install & configure
```bash
npm ci
cp .env.example .env
```
Edit `.env` and set at minimum:
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME
AUTH_SECRET=any-long-random-string-min-16-chars
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
Generate a strong `AUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 2. Create the database tables
```bash
npx drizzle-kit push
```

### 3. (Optional) Seed demo content + admin user
The seed creates sample products/solutions/projects/clients and a demo admin.
```bash
npx tsx src/db/seed.ts     # or: npm run seed (if defined)
```
Demo admin (change before production): `admin@msnss.com` / `admin123`.
To create/reset an admin manually:
```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD',10))"
# then: UPDATE admin_users SET password_hash='<hash>' WHERE email='admin@msnss.com';
```

### 4. Run the dev server
```bash
npm run dev            # http://localhost:3000
```

### 5. Test it locally
- Public site: `http://localhost:3000` (home, `/products`, `/solutions`, `/projects`, `/catalogue`, `/contact`).
- Health check: `http://localhost:3000/api/health` → should return `{ "ok": true, ... }`.
- Admin: `http://localhost:3000/admin/login` → sign in → verify CRUD on Products, Services, Projects, Project Gallery, Clients, Hero, Testimonials, Catalogue, Inquiries.
- Submit a quote on `/contact` → confirm it appears under **Admin → Inquiries** (email is optional locally; the inquiry is still saved).

### 6. Validate before committing / deploying
```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run lint
npm run build
npm start               # run the production build locally
```

## Environment Variables

See `.env.example` for the full annotated list. Summary:

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `DATABASE_URL` | Server only | Yes | PostgreSQL/Supabase connection |
| `AUTH_SECRET` | Server only | Yes (prod) | Signs admin JWT sessions (≥16 chars; the app refuses insecure fallback in production) |
| `NEXT_PUBLIC_SITE_URL` | Client + server | Yes | Canonical URLs, sitemap, OG, email links |
| `RESEND_API_KEY` | Server only | For email | Resend API key |
| `MAIL_FROM` | Server | For email | Verified sender, e.g. `MSNSS <sales@msnss.com>` |
| `OWNER_EMAIL` | Server | For email | Inquiry notification recipient |
| `SUPABASE_URL` | Server | Recommended | Supabase project URL (also whitelists Next/Image host) |
| `SUPABASE_ANON_KEY` | Server | Optional | Public Supabase key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Recommended | Storage admin — never expose to browser |

## Database Setup

1. Create a PostgreSQL database (Supabase or any Postgres 15+).
2. Set `DATABASE_URL`.
3. Apply the schema (see Drizzle Migrations).
4. Verify tables exist (`clients`, `projects`, `project_images`, `products`, `services`, `hero_slides`, `testimonials`, `inquiries`, `inquiry_notes`, `catalogues`, `catalogue_leads`).

### Drizzle Migrations

The schema source of truth is `src/db/schema.ts`. Apply additively:

```bash
npx drizzle-kit push
```

This is safe and additive. **Never** run destructive resets against production (no `drizzle-kit drop`, no manual `DROP TABLE`). Back up before any schema change.

## Supabase Setup

1. Create a Supabase project.
2. Copy the PostgreSQL connection string (Project Settings → Database). Use the pooler URI for serverless hosts; add `?sslmode=require` if required. Set as `DATABASE_URL`.
3. Copy Project URL + keys (Project Settings → API) into `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
4. Apply the schema (`npx drizzle-kit push`) from a trusted machine.
5. Create Storage buckets (below). Keep the service-role key server-only.

## Supabase Storage

Create these **public-read** buckets (writes/deletes happen only through authenticated admin APIs using the service role):

| Bucket | Purpose | Types | Limit |
|---|---|---|---|
| `client-logos` | Client logos | PNG/JPG/WEBP/SVG | 10 MB |
| `project-images` | Project galleries | PNG/JPG/WEBP + MP4/WEBM | 10 MB / 60 MB video |
| `catalogues` | Catalogue PDFs | PDF | 25 MB |
| `hero-media` | Hero images/video | images + video | 10 MB / 60 MB |
| `product-media` | Product photos/video | images + video | 10 MB / 60 MB |
| `solution-media` | Solution photos/video | images + video | 10 MB / 60 MB |

Uploads validate MIME type, size and sanitize filenames server-side. If Supabase is not configured, uploads fall back to local disk (development / persistent Node hosting only — see deployment notes).

## Resend Email Setup

1. Create a Resend account and add your domain.
2. Add the DNS records Resend provides and wait for verification.
3. Create a restricted API key.
4. Set `RESEND_API_KEY`, `MAIL_FROM` (verified sender), `OWNER_EMAIL`, and `NEXT_PUBLIC_SITE_URL`.
5. Deploy, submit a test inquiry, and confirm both customer confirmation and owner notification.

If email is not configured or fails, **the inquiry is still saved** and visible in `/admin/inquiries` — email never blocks the workflow.

Common issues: domain not verified, sender not allowed, invalid key, DNS not propagated.

## Admin Authentication

- Admin URL: `/admin/login`. Sessions are JWT in HTTP-only cookies (Secure on HTTPS), enforced at the edge (`proxy.ts`), in the admin layout, and per admin API.
- Passwords are bcrypt-hashed. `AUTH_SECRET` is mandatory in production.

Provision/reset an admin (run against your database):

```bash
# generate a bcrypt hash for a new password
node -e "console.log(require('bcryptjs').hashSync('YOUR_STRONG_PASSWORD', 10))"
```

```sql
UPDATE admin_users SET password_hash = 'PASTE_HASH' WHERE email = 'admin@msnss.com';
```

Change the seeded demo credentials before launch.

## CMS Usage

All content is managed from `/admin` (sidebar). Each module: list → search/filter → create → edit → publish/unpublish → delete/deactivate.

### Products
`/admin/products` — name, category, descriptions, applications, specifications, features, main image, **photo gallery + video**, order, active.

### Services
`/admin/services` — icon, descriptions, highlights, main image, gallery, video, order, active.

### Projects
`/admin/projects` — client relation, location/region/sector/industry/year/status, scope, services, main image, **project video**, featured, order, active. `/admin/project-gallery` manages per-project images.

### Clients
`/admin/clients` — logo (upload from PC), industry, location, row (1 = left-to-right, 2 = right-to-left), order, featured, active. Deleting a client with projects safely deactivates instead of destroying history.

### Testimonials
`/admin/testimonials` — name/role/company, content, rating, colour, order, active. New entries default to unpublished.

### Hero
`/admin/hero-slides` — title/subtitle, image, **background video**, CTAs, order, active.

### Media
Uploads happen inline in each module via `/api/admin/media` (Supabase or local fallback).

### Inquiries
`/admin/inquiries` — search/filter by status/priority/date/reference, update status/priority, add internal notes (never public), archive, delete.

### Catalogue
`/admin/catalogue` — upload PDF, activate (only one active at a time), deactivate, delete, view leads. Public `/catalogue` offers one-click download + optional lead form. Downloads are served with `Content-Type: application/pdf`.

## Production Security

- Server secrets never reach the browser; only `NEXT_PUBLIC_*` is client-exposed.
- Admin routes protected at the edge + layout + API; JWT HTTP-only, Secure on HTTPS, SameSite=lax.
- Zod validation on all mutations; login + inquiry + catalogue rate limiting (single-instance; use Redis/Upstash for multi-instance).
- Upload MIME/size validation, filename sanitization, path-traversal-guarded media serving.
- `AUTH_SECRET` mandatory in production.

## Hostinger Deployment

Requirements: Node.js 20+, PostgreSQL/Supabase, a domain, HTTPS.

1. Push the repo to a private GitHub repository (never commit `.env`).
2. In hPanel, create a **Node.js application** (Node 20+).
3. Set the application root to the repo root.
4. Install: `npm ci`
5. Build: `npm run build`
6. Start: `npm start` (Next.js reads the `PORT` env var Hostinger provides — do not hardcode a port).
7. Add all environment variables from `.env.example` in hPanel.
8. Apply the schema once from a trusted machine: `npx drizzle-kit push`.
9. Point your domain and enable HTTPS (force HTTPS).
10. Verify: `/api/health`, `/admin/login`, `/products`, `/solutions`, `/projects`, `/catalogue`, `/contact`.

Storage note: local-disk uploads persist only if Hostinger provides a persistent filesystem for the app directory. **Supabase Storage is recommended** so media survives restarts/redeploys.

## Render Deployment

This repo includes `render.yaml`.

1. Create a Render account and a new **Web Service**.
2. Connect the GitHub repository and select the branch.
3. Runtime: **Node**.
4. Build command: `npm ci && npm run build`
5. Start command: `npm start` (Render sets `PORT`; Next.js honors it automatically).
6. Add environment variables (from `.env.example`) in the Environment tab.
7. Deploy and watch the logs.
8. Health check path: `/api/health`.
9. Configure a custom domain and enable HTTPS.
10. Configure Supabase (DB + Storage) and Resend.
11. Verify admin login, an inquiry submission, email delivery, an upload, and catalogue download.

**Important:** Render's filesystem is **ephemeral** — local-disk uploads are lost on redeploy/restart. You **must** configure Supabase Storage for production media on Render.

## Custom Domain

Point your domain's DNS to the host (Hostinger/Render) per their instructions, set `NEXT_PUBLIC_SITE_URL` to the final `https://` URL, and redeploy so canonical/sitemap/OG/email links are correct.

## HTTPS

Enable managed HTTPS on your host and force HTTP→HTTPS. Session cookies are marked Secure automatically on HTTPS requests.

## Database Backup

```bash
pg_dump "$DATABASE_URL" > msnss-backup-$(date +%F).sql
```

Also enable Supabase scheduled backups. Back up before every schema change. Restore only into a tested staging DB first. Never run destructive resets on production.

## Media Backup

Supabase Storage: use bucket downloads / scheduled backups. If using local-disk uploads, back up the `uploads/` directory. Catalogue PDFs live in the `catalogues` bucket (or `uploads/catalogues` locally).

## Health Check

`GET /api/health` returns readiness JSON (no secrets):

```json
{ "ok": true, "status": "ok",
  "checks": { "database": true, "storage": "supabase|local-fallback",
    "email": "configured|not-configured", "authSecret": "configured|missing",
    "siteUrl": "configured|missing" } }
```

Returns 200 when the database is reachable, 503 otherwise.

## Troubleshooting

**Database connection fails** — check `DATABASE_URL`, SSL mode, Supabase pooler URI, and DB availability.

**Storage upload fails** — check `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, bucket names/policies, file size and MIME type. Without Supabase, uploads use local disk (dev only).

**Email not delivered** — check `RESEND_API_KEY`, `MAIL_FROM`, `OWNER_EMAIL`, domain verification and DNS. The inquiry is still saved regardless.

**Admin login fails** — check `AUTH_SECRET`, the `admin_users` record + bcrypt hash, HTTPS/cookie settings.

**Catalogue download fails** — ensure exactly one active catalogue, a valid stored PDF path, and a DB record.

**Render upload disappears** — expected; Render's filesystem is ephemeral. Use Supabase Storage.

**Hostinger upload behavior** — local persistence depends on the plan; prefer Supabase Storage.

## Performance

Server components + lazy media, responsive images, hero video posters, restrained Framer Motion with `prefers-reduced-motion`. Keep uploaded videos compressed; large videos should be hosted on the CDN/Storage and lazy-loaded.

## SEO

Unique metadata + canonicals per route, dynamic `/sitemap.xml` and `/robots.txt`, Organization/Product/Service/Breadcrumb/FAQ JSON-LD. Set `NEXT_PUBLIC_SITE_URL` so all absolute URLs are production URLs (never localhost). Legacy `/services` URLs 308-redirect to `/solutions`.

## Production Checklist

Before deployment:
- [ ] Production database created and backed up
- [ ] Migrations reviewed and applied (`drizzle-kit push`)
- [ ] Storage buckets created with public-read policies
- [ ] Resend domain verified; `MAIL_FROM`/`OWNER_EMAIL` set
- [ ] Strong `AUTH_SECRET` generated; demo admin password changed
- [ ] `NEXT_PUBLIC_SITE_URL` set to the final domain
- [ ] Approved client logos, projects and testimonials in place

Hostinger / Render:
- [ ] Node 20+, repo connected
- [ ] Build `npm ci && npm run build`, start `npm start`
- [ ] All env vars set; domain + HTTPS configured
- [ ] `/api/health` OK; admin login, inquiry, email, upload, catalogue verified

## Rollback Procedure

1. Stop the deployment.
2. Revert to the previous application commit and redeploy.
3. Restore the database from backup only if a schema/data change must be undone.
4. Restore previous environment variables if changed.
5. Verify `/api/health`, the public site, admin, and inquiries.

## Support / Maintenance

- Keep dependencies patched; re-run the validation commands before each release.
- Rotate `AUTH_SECRET` and API keys periodically.
- Review inquiries and catalogue leads in `/admin`.
- Replace representative imagery with authorized MSNSS media as it becomes available.

---

Business content note: client logos, named projects, testimonials and any capability/experience claims must be authorized/verified by MSNSS before launch. The app never fabricates business data.
#   m s n s s - w e b s i t e  
 