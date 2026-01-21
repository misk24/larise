"use client"

import type { Profile } from "@/types/database"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { FileText, Heart, ImageIcon, LayoutDashboard, MessageSquareHeart, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { logo } from "@/constants/logo"

interface DashboardSidebarProps {
  user: User
  profile: Profile | null
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/undangan", icon: FileText, label: "Undangan" },
  { href: "/dashboard/tamu", icon: Users, label: "Daftar Tamu" },
  { href: "/dashboard/ucapan", icon: MessageSquareHeart, label: "Ucapan" },
  { href: "/dashboard/galeri", icon: ImageIcon, label: "Galeri" },
  { href: "/dashboard/pengaturan", icon: Settings, label: "Pengaturan" },
]

function SidebarContent() {
// function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-heading font-normal tracking-widest">
            {logo}
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              // onClick={onItemClick}
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
  )
}

export function DashboardSidebar() {
// export function DashboardSidebar({ user, profile }: DashboardSidebarProps) {
  // const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  // if (isMobile) {
  //   return null
  // }

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-card border-r border-border">
      <SidebarContent />
    </aside>
  )
}

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <LayoutDashboard className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        {/* <SidebarContent onItemClick={() => setIsOpen(false)} /> */}
      </SheetContent>
    </Sheet>
  )
}
