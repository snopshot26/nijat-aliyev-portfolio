import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Lock } from "lucide-react";

import { getSiteContent } from "@/lib/site-content";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen page-grid">
      <div className="container-shell py-6">
        <div className="glass-panel flex flex-col gap-4 rounded-3xl px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary/[0.85]">Admin</p>
            <p className="mt-1 text-lg font-semibold text-white">
              Portfolio control surface for {content.hero.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white transition hover:bg-white/[0.08]"
            >
              <LayoutDashboard className="size-4" />
              Overview
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white transition hover:bg-white/[0.08]"
            >
              <Lock className="size-4" />
              Login
            </Link>
          </div>
        </div>
        <main className="py-10">{children}</main>
      </div>
    </div>
  );
}
