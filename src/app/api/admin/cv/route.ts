import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin-auth";
import {
  cvFileExists,
  getSiteContent,
  removeCvFile,
  saveCvFile,
  saveSiteContent,
} from "@/lib/site-content";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const content = await getSiteContent();
  const hasFile = await cvFileExists();

  return NextResponse.json({
    enabled: content.cv.enabled,
    label: content.cv.label,
    fileName: content.cv.fileName,
    hasFile,
  });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const label = String(formData.get("label") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A PDF file is required." }, { status: 400 });
  }

  try {
    await saveCvFile(file);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save CV.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const content = await getSiteContent();
  const sanitizedName = file.name.toLowerCase().endsWith(".pdf")
    ? file.name
    : `${file.name}.pdf`;

  await saveSiteContent({
    ...content,
    cv: {
      label: label || content.cv.label || "Download CV",
      fileName: sanitizedName,
      enabled: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");

  return NextResponse.json({
    success: true,
    fileName: sanitizedName,
    label: label || content.cv.label || "Download CV",
  });
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await removeCvFile();

  const content = await getSiteContent();
  await saveSiteContent({
    ...content,
    cv: {
      ...content.cv,
      fileName: "",
      enabled: false,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");

  return NextResponse.json({ success: true });
}
