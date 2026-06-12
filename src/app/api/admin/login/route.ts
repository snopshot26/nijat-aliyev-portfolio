import { NextResponse } from "next/server";
import { z } from "zod";

import {
  isValidAdminPassword,
  setAdminSessionCookie,
} from "@/lib/admin-auth";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

export async function POST(request: Request) {
  const body = loginSchema.safeParse(await request.json());

  if (!body.success) {
    return NextResponse.json(
      { error: "Invalid login payload." },
      { status: 400 },
    );
  }

  if (!isValidAdminPassword(body.data.password)) {
    return NextResponse.json(
      { error: "Incorrect admin password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  setAdminSessionCookie(response);
  return response;
}
