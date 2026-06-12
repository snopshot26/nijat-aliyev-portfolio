import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdminRoute } from "@/lib/admin-auth";
import { cvFileExists, getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Admin",
  description: "Private portfolio admin dashboard for Nijat Aliyev.",
};

export default async function AdminPage() {
  await requireAdminRoute();
  const [content, hasCvFile] = await Promise.all([getSiteContent(), cvFileExists()]);

  return <AdminDashboard initialContent={content} initialHasCvFile={hasCvFile} />;
}
