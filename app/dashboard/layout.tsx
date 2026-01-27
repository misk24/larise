import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import { Viewport } from "next"
import { redirect } from "next/navigation"
import type React from "react"

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role === "admin") {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-sidebar">
      <SidebarProvider>
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader user={user} profile={profile} />
          <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
