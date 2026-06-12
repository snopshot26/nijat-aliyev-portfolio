import { NextResponse } from "next/server";

import { cvFileExists, getSiteContent, readCvFile } from "@/lib/site-content";

const DEFAULT_CV_FILENAME = "Nijat Aliyev CV.pdf";

function buildContentDisposition(fileName: string) {
  const encoded = encodeURIComponent(fileName);
  return `attachment; filename="${fileName}"; filename*=UTF-8''${encoded}`;
}

export async function GET() {
  const [content, hasCv] = await Promise.all([getSiteContent(), cvFileExists()]);

  if (!content.cv.enabled || !hasCv) {
    return NextResponse.json({ error: "CV not available." }, { status: 404 });
  }

  const file = await readCvFile();
  const fileName = content.cv.fileName || DEFAULT_CV_FILENAME;

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": buildContentDisposition(fileName),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
