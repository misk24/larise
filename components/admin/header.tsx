"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logo } from "@/constants/logo"
import { adminNavs } from "@/constants/navigation"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/actions/auth"
import type { Profile } from "@/types/database"
import type { User } from "@supabase/supabase-js"
import { LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

// interface AdminHeaderProps {
//   user: User
//   profile: Profile | null
// }

export function AdminHeader() {
// export function AdminHeader({ user, profile }: AdminHeaderProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // const initials =
  //   profile?.full_name
  //     ?.split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase()
  //     .slice(0, 2) ||
  //   user.email?.[0].toUpperCase() ||
  //   "A"

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex h-15 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Sheet 
            open={isOpen} 
            onOpenChange={setIsOpen}
          >
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />

                <span className="sr-only">
                  Menu
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="p-0 w-64"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border">
                  <Link 
                    onClick={() => setIsOpen(false)}
                    href="/admin/dashboard" 
                    className="flex items-center gap-2" 
                  >
                    <span className="text-xl font-heading font-normal tracking-widest">
                      {logo}
                    </span>
                  </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                  {adminNavs.map((link) => {
                    const isActive = pathname === link.href

                    return (
                      <Link
                        onClick={() => setIsOpen(false)}
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                      >
                        <link.icon className="h-5 w-5" />

                        {link.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <h3 className="sm:hidden">
            Admin Panel
          </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-10 w-10 rounded-full"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
                {/* <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback> */}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            align="end" 
            className="w-56"
          >
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">
                  Admin
                </p>
                {/* <p className="font-medium">{profile?.full_name || "Admin"}</p> */}
                <p className="text-sm text-muted-foreground">admin@email.com</p>
                {/* <p className="text-sm text-muted-foreground">{user.email}</p> */}
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => signOut()}
              className="cursor-pointer focus:text-destructive"
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
