import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin-auth";
import { uploadProjectPreviewImage } from "@/lib/content-storage";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const slug = String(formData.get("slug") ?? "").trim();
    const file = formData.get("file");

    if (!slug) {
      return NextResponse.json({ error: "Project slug is required." }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "An image file is required." }, { status: 400 });
    }

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP, or AVIF images are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });
    }

    const content = await getSiteContent();
    const project = content.projectArchive.projects.find((item) => item.slug === slug);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const previewImage = await uploadProjectPreviewImage(slug, file);

    await saveSiteContent({
      ...content,
      projectArchive: {
        ...content.projectArchive,
        projects: content.projectArchive.projects.map((item) =>
          item.slug === slug ? { ...item, previewImage } : item,
        ),
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, previewImage });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to upload preview image.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
