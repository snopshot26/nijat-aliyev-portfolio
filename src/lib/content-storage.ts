import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { head, put } from "@vercel/blob";

import type { SiteContent } from "@/lib/site-content-schema";

const SITE_CONTENT_BLOB_PATH = "portfolio/site-content.json";

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

function canUseBlobStorage() {
  return Boolean(getBlobToken());
}

async function readSiteContentFromBlob(): Promise<SiteContent | null> {
  const token = getBlobToken();
  if (!token) {
    return null;
  }

  try {
    const blob = await head(SITE_CONTENT_BLOB_PATH, { token });
    const response = await fetch(blob.url);

    if (!response.ok) {
      return null;
    }

    return JSON.parse(await response.text()) as SiteContent;
  } catch {
    return null;
  }
}

export async function writeSiteContentToBlob(content: SiteContent) {
  const token = getBlobToken();
  if (!token) {
    throw new Error("Blob storage is not configured.");
  }

  await put(SITE_CONTENT_BLOB_PATH, JSON.stringify(content, null, 2), {
    access: "public",
    token,
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function readSiteContentFromDisk(filePath: string) {
  return readFile(filePath, "utf8");
}

export async function writeSiteContentToDisk(filePath: string, content: SiteContent) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

export async function canWriteToDisk(filePath: string) {
  if (process.env.VERCEL === "1") {
    return false;
  }

  try {
    await access(path.dirname(filePath));
    return true;
  } catch {
    return true;
  }
}

export async function resolveSiteContentSource(
  filePath: string,
  fallback: () => Promise<SiteContent>,
) {
  if (canUseBlobStorage()) {
    const blobContent = await readSiteContentFromBlob();
    if (blobContent) {
      return blobContent;
    }
  }

  return fallback();
}

export async function persistSiteContent(filePath: string, content: SiteContent) {
  const errors: string[] = [];

  if (await canWriteToDisk(filePath)) {
    try {
      await writeSiteContentToDisk(filePath, content);
      return;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Disk write failed.");
    }
  }

  if (canUseBlobStorage()) {
    try {
      await writeSiteContentToBlob(content);
      return;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Blob write failed.");
    }
  }

  throw new Error(
    errors.join(" ") ||
      "Unable to persist site content. Configure Vercel Blob or save changes locally.",
  );
}

const extensionByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function uploadProjectPreviewImage(slug: string, file: File) {
  const extension = extensionByMime[file.type] ?? "jpg";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (canUseBlobStorage()) {
    const blob = await put(`portfolio/project-previews/${slug}.${extension}`, buffer, {
      access: "public",
      token: getBlobToken(),
      contentType: file.type,
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return blob.url;
  }

  const publicDir = path.join(process.cwd(), "public", "projects");
  const fileName = `${slug}.${extension}`;
  const publicPath = `/projects/${fileName}`;

  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, fileName), buffer);

  return publicPath;
}
