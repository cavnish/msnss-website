import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const storageEnabled = true; // local disk fallback always available
export const supabaseEnabled = Boolean(url && key);
const supabase = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
export const BUCKETS = { clients: "client-logos", projects: "project-images", catalogues: "catalogues" } as const;

// Runtime-writable upload directory (served via /api/media/[...path]).
export const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

function limitsFor(category: keyof typeof BUCKETS, type: string) {
  if (category === "catalogues") return { allowed: ["application/pdf"], max: 25 * 1024 * 1024 };
  if (VIDEO_TYPES.includes(type)) return { allowed: VIDEO_TYPES, max: 60 * 1024 * 1024 };
  return { allowed: IMAGE_TYPES, max: 10 * 1024 * 1024 };
}

function safeName(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70) || "asset";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}.${ext}`;
}

export async function uploadAsset(file: File, category: keyof typeof BUCKETS) {
  const { allowed, max } = limitsFor(category, file.type);
  if (!allowed.includes(file.type)) throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  if (file.size > max) throw new Error(`File exceeds ${Math.round(max / 1024 / 1024)} MB limit`);
  const filename = safeName(file);
  const buffer = Buffer.from(await file.arrayBuffer());

  // Prefer Supabase when configured (works across serverless instances)
  if (supabase) {
    const storagePath = `${new Date().getFullYear()}/${filename}`;
    const bucket = BUCKETS[category];
    const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, { contentType: file.type, upsert: false });
    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
      return { url: data.publicUrl, path: storagePath, bucket, fileName: file.name };
    }
    // fall through to local disk if Supabase upload fails
  }

  // Local disk fallback → uploads/<category>/<filename>, served via /api/media
  const dir = path.join(UPLOAD_ROOT, category);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  const publicUrl = `/api/media/${category}/${filename}`;
  return { url: publicUrl, path: publicUrl, bucket: "local", fileName: file.name };
}

export async function deleteAsset(bucket: string, assetPath: string) {
  if (bucket === "local" || assetPath.startsWith("/api/media/")) {
    try {
      const rel = assetPath.replace(/^\/api\/media\//, "");
      await unlink(path.join(UPLOAD_ROOT, rel));
    } catch {
      /* ignore missing file */
    }
    return;
  }
  if (!supabase) return;
  const { error } = await supabase.storage.from(bucket).remove([assetPath]);
  if (error) throw error;
}
