import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Footer } from "@/components/shared/footer";
import { getUser, getUserProfile } from "@/lib/actions/auth";
import { Viewport } from "next";
import { redirect } from "next/navigation";
import type React from "react";

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const profile = await getUserProfile();

  if (!user) {
    redirect("/login");
  }

  if (profile?.role !== "user") {
    redirect("/admin");
  }

  return (
    <DashboardShell
      sidebar={<DashboardSidebar />}
      header={<DashboardHeader user={user} profile={profile} />}
      footer={<Footer />}
    >
      {children}
    </DashboardShell>
  );
}
