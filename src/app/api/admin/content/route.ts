import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";
import { siteContentSchema } from "@/lib/site-content-schema";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = siteContentSchema.safeParse(await request.json());

  if (!body.success) {
    return NextResponse.json(
      { error: "Content validation failed.", issues: body.error.flatten() },
      { status: 400 },
    );
  }

  await saveSiteContent(body.data);
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin");

  return NextResponse.json({ success: true });
}
