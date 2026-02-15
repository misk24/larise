import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader } from "@/components/admin/header";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Footer } from "@/components/shared/footer";
import { getUser, getUserProfile } from "@/lib/actions/auth";
import { Viewport } from "next";
import { redirect } from "next/navigation";

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const profile = await getUserProfile();

  if (!user) {
    redirect("/login");
  }

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <AdminShell
      sidebar={<AdminSidebar />}
      header={<AdminHeader user={user} profile={profile} />}
      footer={<Footer />}
    >
      {children}
    </AdminShell>
  );
}
