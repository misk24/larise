"use client"

import type { Profile } from "@/types/database"
import type { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/actions/auth"
import { LogOut, UserIcon } from "lucide-react"
import { MobileSidebar } from "./sidebar"

interface DashboardHeaderProps {
  user: User
  profile: Profile | null
}

export function DashboardHeader() {
// export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  // const initials =
  //   profile?.full_name
  //     ?.split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase()
  //     .slice(0, 2) ||
  //   user.email?.[0].toUpperCase() ||
  //   "U"

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex h-15 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <MobileSidebar />
          <h3>Dashboard</h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">E</AvatarFallback>
                {/* <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback> */}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">"User"</p>
                {/* <p className="font-medium">{profile?.full_name || "User"}</p> */}
                <p className="text-sm text-muted-foreground">"user.email"</p>
                {/* <p className="text-sm text-muted-foreground">{user.email}</p> */}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/dashboard/pengaturan" className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                Pengaturan
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
