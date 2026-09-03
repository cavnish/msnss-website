"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AdminPage,
  Modal,
  Field,
  inputCls,
  EmptyState,
  TableSkeleton,
} from "@/components/admin/AdminUI";

import type { HeroSlide } from "@/db/schema";

type Form = {
  id?: number;
  title: string;
  subtitle: string;
  supportingLine: string;
  imageUrl: string;
  videoUrl: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  sortOrder: number;
  active: boolean;
};

const empty: Form = {
  title: "",
  subtitle: "",
  supportingLine: "",
  imageUrl: "/images/hero-1.jpg",
  videoUrl: "",
  primaryCtaLabel: "Get a Quote",
  primaryCtaLink: "/contact",
  secondaryCtaLabel: "View Products",
  secondaryCtaLink: "/products",
  sortOrder: 0,
  active: true,
};

export default function HeroSlidesAdmin() {
  const [items, setItems] =
    useState<HeroSlide[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState<Form | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [uploadingVideo, setUploadingVideo] =
    useState(false);

  const imageInputRef =
    useRef<HTMLInputElement>(null);

  const videoInputRef =
    useRef<HTMLInputElement>(null);

  // --------------------------------------------------
  // SAFE RESPONSE READER
  // --------------------------------------------------

  async function readResponse(
    response: Response
  ) {
    const text =
      await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      console.error(
        "Server returned non-JSON response:",
        text
      );

      throw new Error(
        text ||
          `Server returned HTTP ${response.status}`
      );
    }
  }

  // --------------------------------------------------
  // LOAD
  // --------------------------------------------------

  async function load() {
    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/admin/hero-slides",
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const data =
        await readResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to load hero slides."
        );
      }

      setItems(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Hero slide load error:",
        error
      );

      setItems([]);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load hero slides."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id =
      requestAnimationFrame(
        load
      );

    return () =>
      cancelAnimationFrame(id);
  }, []);

  // --------------------------------------------------
  // UPLOAD
  // --------------------------------------------------

  async function uploadFile(
    file: File,
    type: "image" | "video"
  ) {
    if (type === "image") {
      setUploadingImage(true);
    } else {
      setUploadingVideo(true);
    }

    try {
      // ------------------------------------------------
      // CLIENT VALIDATION
      // ------------------------------------------------

      if (type === "image") {
        const allowed = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/avif",
        ];

        if (
          !allowed.includes(
            file.type
          )
        ) {
          throw new Error(
            "Please select a JPG, PNG, WebP or AVIF image."
          );
        }

        if (
          file.size >
          10 * 1024 * 1024
        ) {
          throw new Error(
            "Image is too large. Maximum size is 10MB."
          );
        }
      }

      if (type === "video") {
        const allowed = [
          "video/mp4",
          "video/webm",
        ];

        if (
          !allowed.includes(
            file.type
          )
        ) {
          throw new Error(
            "Please select an MP4 or WebM video."
          );
        }

        if (
          file.size >
          100 * 1024 * 1024
        ) {
          throw new Error(
            "Video is too large. Maximum size is 100MB."
          );
        }
      }

      // ------------------------------------------------
      // IMPORTANT:
      // Send file as BINARY instead of FormData.
      //
      // This prevents Next.js Server Action
      // interception of multipart/form-data.
      // ------------------------------------------------

      const response =
        await fetch(
          "/api/admin/upload",
          {
            method: "POST",
            headers: {
              "Content-Type":
                file.type,
              "X-Upload-Type":
                type,
            },
            body: file,
          }
        );

      const result =
        await readResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Upload failed."
        );
      }

      if (
        !result?.success ||
        !result?.url
      ) {
        throw new Error(
          "Upload completed but the server did not return a file URL."
        );
      }

      // ------------------------------------------------
      // UPDATE FORM
      // ------------------------------------------------

      setForm(
        (current) => {
          if (!current) {
            return current;
          }

          if (type === "image") {
            return {
              ...current,
              imageUrl:
                result.url,
            };
          }

          return {
            ...current,
            videoUrl:
              result.url,
          };
        }
      );

      console.log(
        "Upload successful:",
        result
      );

      alert(
        type === "image"
          ? "Image uploaded successfully."
          : "Video uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Upload error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to upload file."
      );
    } finally {
      if (type === "image") {
        setUploadingImage(false);
      } else {
        setUploadingVideo(false);
      }
    }
  }

  // --------------------------------------------------
  // IMAGE
  // --------------------------------------------------

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    await uploadFile(
      file,
      "image"
    );

    e.target.value = "";
  }

  // --------------------------------------------------
  // VIDEO
  // --------------------------------------------------

  async function handleVideoUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    await uploadFile(
      file,
      "video"
    );

    e.target.value = "";
  }

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  async function save(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!form) {
      return;
    }

    setSaving(true);

    try {
      const url = form.id
        ? `/api/admin/hero-slides/${form.id}`
        : "/api/admin/hero-slides";

      const response =
        await fetch(
          url,
          {
            method: form.id
              ? "PUT"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ...form,
              videoUrl:
                form.videoUrl.trim() ||
                null,
            }),
          }
        );

      const result =
        await readResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Unable to save slide."
        );
      }

      const wasEdit =
        Boolean(form.id);

      setForm(null);

      await load();

      alert(
        wasEdit
          ? "Hero slide updated successfully."
          : "Hero slide created successfully."
      );
    } catch (error) {
      console.error(
        "Save error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to save slide."
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function remove(
    id: number
  ) {
    if (
      !confirm(
        "Delete this hero slide?"
      )
    ) {
      return;
    }

    try {
      const response =
        await fetch(
          `/api/admin/hero-slides/${id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await readResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Unable to delete slide."
        );
      }

      setItems(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== id
          )
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete slide."
      );

      await load();
    }
  }

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function editSlide(
    slide: HeroSlide
  ) {
    setForm({
      id: slide.id,
      title:
        slide.title ?? "",
      subtitle:
        slide.subtitle ?? "",
      supportingLine:
        slide.supportingLine ?? "",
      imageUrl:
        slide.imageUrl ?? "",
      videoUrl:
        slide.videoUrl ?? "",
      primaryCtaLabel:
        slide.primaryCtaLabel ?? "",
      primaryCtaLink:
        slide.primaryCtaLink ?? "",
      secondaryCtaLabel:
        slide.secondaryCtaLabel ?? "",
      secondaryCtaLink:
        slide.secondaryCtaLink ?? "",
      sortOrder:
        slide.sortOrder ?? 0,
      active:
        slide.active ?? true,
    });
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AdminPage
      title="Hero Slider"
      action={
        <button
          type="button"
          onClick={() =>
            setForm({
              ...empty,
            })
          }
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Add Slide
        </button>
      }
    >
      {loading ? (
        <TableSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          icon="🖼️"
          title="No slides"
          text="Add slides for the homepage hero slider."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(
            (slide) => (
              <div
                key={slide.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {slide.imageUrl ? (
                  <img
                    src={
                      slide.imageUrl
                    }
                    alt=""
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center bg-slate-100 text-sm text-slate-400">
                    No image
                  </div>
                )}

                <div className="p-4">
                  <h3 className="line-clamp-1 font-bold text-ink">
                    {slide.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {slide.subtitle}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        editSlide(
                          slide
                        )
                      }
                      className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold hover:bg-slate-200"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        remove(
                          slide.id
                        )
                      }
                      className="rounded bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>

                    {slide.active ? (
                      <span className="ml-auto text-xs font-medium text-green-600">
                        Active
                      </span>
                    ) : (
                      <span className="ml-auto text-xs text-slate-400">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <Modal
        open={!!form}
        onClose={() => {
          if (
            !saving &&
            !uploadingImage &&
            !uploadingVideo
          ) {
            setForm(null);
          }
        }}
        title={
          form?.id
            ? "Edit Hero Slide"
            : "Add Hero Slide"
        }
      >
        {form && (
          <form
            onSubmit={save}
            className="space-y-5"
          >
            {/* TITLE */}

            <Field label="Title">
              <input
                required
                className={inputCls}
                value={
                  form.title
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
                placeholder="Precision HVAC Solutions"
              />
            </Field>

            {/* SUBTITLE */}

            <Field label="Subtitle">
              <textarea
                required
                rows={3}
                className={inputCls}
                value={
                  form.subtitle
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    subtitle:
                      e.target.value,
                  })
                }
                placeholder="Engineered ductwork for modern industrial and commercial projects."
              />
            </Field>

            {/* SUPPORTING LINE */}

            <Field label="Supporting Line">
              <input
                className={inputCls}
                value={
                  form.supportingLine
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    supportingLine:
                      e.target.value,
                  })
                }
                placeholder="Manufacturing • Fabrication • Installation"
              />
            </Field>

            {/* IMAGE */}

            <Field label="Hero Image">
              <div className="space-y-3">
                {form.imageUrl && (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={
                        form.imageUrl
                      }
                      alt="Hero preview"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}

                <button
                  type="button"
                  disabled={
                    uploadingImage
                  }
                  onClick={() =>
                    imageInputRef.current?.click()
                  }
                  className="w-full rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 hover:border-brand hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingImage
                    ? "⏳ Uploading image..."
                    : "📁 Upload Image from Local Drive"}
                </button>

                <input
                  ref={
                    imageInputRef
                  }
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={
                    handleImageUpload
                  }
                />

                <p className="text-center text-xs text-slate-400">
                  JPG · PNG · WebP ·
                  AVIF · Maximum 10MB
                </p>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>

                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs text-slate-400">
                      OR USE IMAGE URL
                    </span>
                  </div>
                </div>

                <input
                  className={inputCls}
                  value={
                    form.imageUrl
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      imageUrl:
                        e.target.value,
                    })
                  }
                  placeholder="/uploads/hero/image.jpg"
                />
              </div>
            </Field>

            {/* VIDEO */}

            <Field label="Background Video">
              <div className="space-y-3">
                {form.videoUrl && (
                  <div className="overflow-hidden rounded-xl bg-black">
                    <video
                      src={
                        form.videoUrl
                      }
                      controls
                      muted
                      playsInline
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}

                <button
                  type="button"
                  disabled={
                    uploadingVideo
                  }
                  onClick={() =>
                    videoInputRef.current?.click()
                  }
                  className="w-full rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 hover:border-brand hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingVideo
                    ? "⏳ Uploading video..."
                    : "🎥 Upload Video from Local Drive"}
                </button>

                <input
                  ref={
                    videoInputRef
                  }
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={
                    handleVideoUpload
                  }
                />

                <p className="text-center text-xs text-slate-400">
                  MP4 · WebM · Maximum
                  100MB
                </p>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>

                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs text-slate-400">
                      OR USE VIDEO URL
                    </span>
                  </div>
                </div>

                <input
                  className={inputCls}
                  value={
                    form.videoUrl
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      videoUrl:
                        e.target.value,
                    })
                  }
                  placeholder="https://example.com/hero.mp4"
                />
              </div>
            </Field>

            {/* CTA */}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Primary Button Label">
                <input
                  className={inputCls}
                  value={
                    form.primaryCtaLabel
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      primaryCtaLabel:
                        e.target.value,
                    })
                  }
                  placeholder="Get a Quote"
                />
              </Field>

              <Field label="Primary Button Link">
                <input
                  className={inputCls}
                  value={
                    form.primaryCtaLink
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      primaryCtaLink:
                        e.target.value,
                    })
                  }
                  placeholder="/contact"
                />
              </Field>

              <Field label="Secondary Button Label">
                <input
                  className={inputCls}
                  value={
                    form.secondaryCtaLabel
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      secondaryCtaLabel:
                        e.target.value,
                    })
                  }
                  placeholder="View Products"
                />
              </Field>

              <Field label="Secondary Button Link">
                <input
                  className={inputCls}
                  value={
                    form.secondaryCtaLink
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      secondaryCtaLink:
                        e.target.value,
                    })
                  }
                  placeholder="/products"
                />
              </Field>
            </div>

            {/* SORT */}

            <Field label="Sort Order">
              <input
                type="number"
                min="0"
                className={inputCls}
                value={
                  form.sortOrder
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    sortOrder:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
            </Field>

            {/* ACTIVE */}

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={
                  form.active
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    active:
                      e.target.checked,
                  })
                }
              />

              <span>
                Active
              </span>
            </label>

            {/* BUTTONS */}

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                disabled={
                  saving ||
                  uploadingImage ||
                  uploadingVideo
                }
                onClick={() =>
                  setForm(null)
                }
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  saving ||
                  uploadingImage ||
                  uploadingVideo
                }
                className="rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : form.id
                    ? "Update Slide"
                    : "Save Slide"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </AdminPage>
  );
}