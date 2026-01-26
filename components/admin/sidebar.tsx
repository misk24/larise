"use client"

import { adminNavs } from "@/constants/backend"
import { logo } from "@/constants/logo"
import { cn } from "@/lib/utils"
import { LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-card border-r border-border">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-xl font-logo font-normal tracking-widest">
              {logo}
            </span>

            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNavs.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
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

        <div className="p-4 border-t border-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" /> 
            User Dashboard
          </Link>
        </div>
      </div>
    </aside>
  )
}
