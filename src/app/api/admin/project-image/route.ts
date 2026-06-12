import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const extensionByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request: NextRequest) {
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

  const extension = extensionByMime[file.type] ?? "jpg";
  const publicDir = path.join(process.cwd(), "public", "projects");
  const fileName = `${slug}.${extension}`;
  const publicPath = `/projects/${fileName}`;

  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, fileName), Buffer.from(await file.arrayBuffer()));

  await saveSiteContent({
    ...content,
    projectArchive: {
      ...content.projectArchive,
      projects: content.projectArchive.projects.map((item) =>
        item.slug === slug ? { ...item, previewImage: publicPath } : item,
      ),
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin");

  return NextResponse.json({ success: true, previewImage: publicPath });
}
