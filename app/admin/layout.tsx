import { AdminHeader } from "@/components/admin/header"
import { AdminSidebar } from "@/components/admin/sidebar"
import { createClient } from "@/lib/supabase/server"
import { Viewport } from "next"
import { redirect } from "next/navigation"

export const viewport: Viewport = {
  themeColor: "#eeebe0",
  width: "device-width",
  initialScale: 1,
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const supabase = await createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect("/login")
  // }

  // const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // if (profile?.role !== "admin") {
  //   redirect("/dashboard")
  // }

  return (
    <div className="min-h-screen bg-secondary/20">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        {/* <AdminHeader user={user} profile={profile} /> */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
