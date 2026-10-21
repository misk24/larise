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

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const profile = await getUserProfile();
  if (!user) redirect("/login");
  if (profile?.role !== "user") redirect("/admin");

  return (
    <BackendShell
      variant="dashboard"
      sidebar={<BackendSidebar role="user" />}
      header={<BackendHeader user={user} profile={profile} role="user" />}
      breadcrumbs={<BackendBreadcrumb role="user" />}
      footer={<Footer />}
    >
      {children}
    </BackendShell>
  );
}
