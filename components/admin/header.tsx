"use client"

import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/database"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/actions/auth"
import { Heart, LayoutDashboard, LogOut, Menu, Palette, Settings, ShoppingCart, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LOGO } from "@/constants/logo"

// interface AdminHeaderProps {
//   user: User
//   profile: Profile | null
// }

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Pengguna" },
  { href: "/admin/themes", icon: Palette, label: "Tema" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Pesanan" },
  { href: "/admin/settings", icon: Settings, label: "Pengaturan" },
]

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
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border">
                  <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <span className="text-xl font-heading font-normal tracking-widest">{LOGO}</span>
                  </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">"A"</AvatarFallback>
                {/* <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback> */}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">"Admin"</p>
                {/* <p className="font-medium">{profile?.full_name || "Admin"}</p> */}
                <p className="text-sm text-muted-foreground">"user.email"</p>
                {/* <p className="text-sm text-muted-foreground">{user.email}</p> */}
              </div>
            </div>
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
