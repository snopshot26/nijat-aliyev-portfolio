import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { persistSiteContent, resolveSiteContentSource } from "@/lib/content-storage";
import { siteContentSchema, type SiteContent } from "@/lib/site-content-schema";

const dataDir = path.join(process.cwd(), "data");
const siteContentPath = path.join(dataDir, "site-content.json");
const cvFileCandidates = [path.join(dataDir, "cv"), path.join(dataDir, "cv.pdf")];
export const cvFilePath = cvFileCandidates[0];

const MAX_CV_BYTES = 10 * 1024 * 1024;

async function resolveCvFilePath() {
  for (const candidate of cvFileCandidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

export async function getSiteContent(): Promise<SiteContent> {
  return resolveSiteContentSource(siteContentPath, async () => {
    const raw = await readFile(siteContentPath, "utf8");
    return siteContentSchema.parse(JSON.parse(raw));
  }).then((content) => siteContentSchema.parse(content));
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const parsed = siteContentSchema.parse(content);
  await persistSiteContent(siteContentPath, parsed);
  return parsed;
}

export async function cvFileExists() {
  return (await resolveCvFilePath()) !== null;
}

export async function saveCvFile(file: File) {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }

  if (file.size > MAX_CV_BYTES) {
    throw new Error("CV file must be 10 MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await mkdir(dataDir, { recursive: true });
  await writeFile(cvFilePath, buffer);
}

export async function removeCvFile() {
  for (const candidate of cvFileCandidates) {
    try {
      await unlink(candidate);
    } catch {
      // File may already be missing.
    }
  }
}

export async function readCvFile() {
  const filePath = await resolveCvFilePath();

  if (!filePath) {
    throw new Error("CV file not found.");
  }

  return readFile(filePath);
}
