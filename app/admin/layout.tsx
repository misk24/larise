import { BackendBreadcrumb } from "@/components/backend/backend-breadcrumb";
import { BackendHeader } from "@/components/backend/backend-header";
import { BackendShell } from "@/components/backend/backend-shell";
import { BackendSidebar } from "@/components/backend/backend-sidebar";
import { Footer } from "@/components/shared/footer";
import { getUser, getUserProfile } from "@/lib/actions/auth";
import type { Viewport } from "next";
import { redirect } from "next/navigation";
import type React from "react";

export const viewport: Viewport = {
  themeColor: "var(--background)",
  width: "device-width",
  initialScale: 1,
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const profile = await getUserProfile();
  if (!user) redirect("/login");
  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <BackendShell
      variant="admin"
      sidebar={<BackendSidebar role="admin" />}
      header={<BackendHeader user={user} profile={profile} role="admin" />}
      breadcrumbs={<BackendBreadcrumb role="admin" />}
      footer={<Footer />}
    >
      {children}
    </BackendShell>
  );
}
