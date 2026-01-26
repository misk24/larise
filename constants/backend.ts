import { AdminNavProps, UserNavProps } from "@/types/backend"
import { FileText, ImageIcon, LayoutDashboard, MessageSquareHeart, Palette, Settings, ShoppingCart, Users } from "lucide-react"

export const adminNavs: AdminNavProps[] = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/themes", icon: Palette, label: "Themes" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
]

export const userNavs: UserNavProps[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/invitations", icon: FileText, label: "Invitations" },
  { href: "/dashboard/guests", icon: Users, label: "Guests" },
  { href: "/dashboard/wishes", icon: MessageSquareHeart, label: "Wishes" },
  { href: "/dashboard/gallery", icon: ImageIcon, label: "Gallery" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export const subpageNavs: Record<string, string> = {
  create: "Create",
}
