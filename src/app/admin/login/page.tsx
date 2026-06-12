import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { GlassPanel } from "@/components/shared/glass-panel";
import { redirectIfAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin login foundation for the Nijat Aliyev portfolio.",
};

export default async function AdminLoginPage() {
  await redirectIfAuthenticated();

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.24em] text-primary/[0.85]">Access</p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-white">
          Private dashboard access with file-backed content controls.
        </h1>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          Sign in with the admin password stored in `.env.local` to manage public content,
          the project archive, featured projects, and visibility settings.
        </p>
      </div>

      <GlassPanel className="p-6 md:p-8">
        <AdminLoginForm />
      </GlassPanel>
    </div>
  );
}
