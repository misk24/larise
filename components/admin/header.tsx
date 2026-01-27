"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { Profile } from "@/types/database"
import type { User } from "@supabase/supabase-js"
import { Separator } from "../ui/separator"
import { AdminProfile } from "./profile"
import { Breadcrumbs } from "./breadcrumb"

interface AdminHeaderProps {
  user: User
  profile: Profile | null
}

export function AdminHeader({ user, profile }: AdminHeaderProps) {
  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user.email?.[0].toUpperCase() || "A"

  return (
    <header className="sticky top-0 z-50 border-b bg-sidebar">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:bg-accent/10" />
          <Separator orientation="vertical" className="hidden h-4! sm:block" />
          <Breadcrumbs />
        </div>

        <div className="flex items-center gap-4">
          <AdminProfile
            trigger={
              <Button variant="ghost" size="icon" className="size-9.5 rounded-full">
                <Avatar className="size-9.5">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "Admin"} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
        </div>
      </div>
    </header>
  )
}
