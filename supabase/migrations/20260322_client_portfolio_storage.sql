-- Run in a Supabase project only. Application tables are managed by Drizzle.
-- Creates public delivery buckets; uploads/deletes are performed only by authenticated server APIs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('client-logos','client-logos',true,5242880,array['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('project-images','project-images',true,5242880,array['image/png','image/jpeg','image/webp']),
  ('catalogues','catalogues',true,15728640,array['application/pdf'])
on conflict (id) do update set
  public=excluded.public,
  file_size_limit=excluded.file_size_limit,
  allowed_mime_types=excluded.allowed_mime_types;

-- Public visitors may view published media URLs. No public insert/update/delete policies are created.
drop policy if exists "public read client logos" on storage.objects;
create policy "public read client logos" on storage.objects for select to public using (bucket_id='client-logos');
drop policy if exists "public read project images" on storage.objects;
create policy "public read project images" on storage.objects for select to public using (bucket_id='project-images');
drop policy if exists "public read catalogues" on storage.objects;
create policy "public read catalogues" on storage.objects for select to public using (bucket_id='catalogues');
