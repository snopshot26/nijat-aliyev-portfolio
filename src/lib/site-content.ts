import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { siteContentSchema, type SiteContent } from "@/lib/site-content-schema";

const siteContentPath = path.join(process.cwd(), "data", "site-content.json");

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await readFile(siteContentPath, "utf8");
  return siteContentSchema.parse(JSON.parse(raw));
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const parsed = siteContentSchema.parse(content);
  await mkdir(path.dirname(siteContentPath), { recursive: true });
  await writeFile(siteContentPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
  return parsed;
}
