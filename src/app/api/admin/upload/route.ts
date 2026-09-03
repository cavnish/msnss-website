import { requireAuth } from "@/lib/admin-api";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

const ALLOWED_IMAGES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

const ALLOWED_VIDEOS = new Map([
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
]);

export async function POST(req: Request) {
  try {
    // Admin authentication
    const auth = await requireAuth();

    if (auth) {
      return auth;
    }

    // Frontend sends the actual file as binary
    const contentType =
      req.headers.get("content-type")?.toLowerCase() || "";

    const fileType = contentType.split(";")[0].trim();

    const isImage = ALLOWED_IMAGES.has(fileType);
    const isVideo = ALLOWED_VIDEOS.has(fileType);

    if (!isImage && !isVideo) {
      return Response.json(
        {
          success: false,
          error:
            "Invalid file type. Allowed: JPG, PNG, WebP, AVIF, MP4 and WebM.",
        },
        { status: 400 }
      );
    }

    const maxSize = isImage
      ? MAX_IMAGE_SIZE
      : MAX_VIDEO_SIZE;

    const contentLength = req.headers.get("content-length");

    if (contentLength) {
      const fileSize = Number(contentLength);

      if (fileSize > maxSize) {
        return Response.json(
          {
            success: false,
            error: isImage
              ? "Image is too large. Maximum size is 10MB."
              : "Video is too large. Maximum size is 100MB.",
          },
          { status: 400 }
        );
      }
    }

    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer.length) {
      return Response.json(
        {
          success: false,
          error: "The uploaded file is empty.",
        },
        { status: 400 }
      );
    }

    if (buffer.length > maxSize) {
      return Response.json(
        {
          success: false,
          error: isImage
            ? "Image is too large. Maximum size is 10MB."
            : "Video is too large. Maximum size is 100MB.",
        },
        { status: 400 }
      );
    }

    const extension = isImage
      ? ALLOWED_IMAGES.get(fileType)
      : ALLOWED_VIDEOS.get(fileType);

    if (!extension) {
      return Response.json(
        {
          success: false,
          error: "Unable to determine file extension.",
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const filename = `${crypto.randomUUID()}.${extension}`;

    // public/uploads/hero
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "hero"
    );

    await mkdir(uploadDir, {
      recursive: true,
    });

    const filepath = path.join(
      uploadDir,
      filename
    );

    await writeFile(filepath, buffer);

    // Public URL used by the website
    const url = `/uploads/hero/${filename}`;

    console.log("[Hero Upload] File saved:", filepath);
    console.log("[Hero Upload] Public URL:", url);

    return Response.json(
      {
        success: true,
        url,
        type: isImage ? "image" : "video",
        filename,
        size: buffer.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Hero Upload Error]", error);

    return Response.json(
      {
        success: false,
        error: "Unable to upload file. Please try again.",
      },
      { status: 500 }
    );
  }
}