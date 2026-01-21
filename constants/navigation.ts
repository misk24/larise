import { AdminNavProps, NavProps } from "@/types/navigation"
import { LayoutDashboard, Palette, Settings, ShoppingCart, Users } from "lucide-react"

export const navLinks: NavProps[] = [
  { label: "Features", href: "#features" },
  { label: "Collections", href: "#collections" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimoni", href: "#testimoni" },
]

export const adminNavs: AdminNavProps[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Pengguna", href: "/admin/users" },
  { icon: Palette, label: "Tema", href: "/admin/themes" },
  { icon: ShoppingCart, label: "Pesanan", href: "/admin/orders" },
  { icon: Settings, label: "Pengaturan", href: "/admin/settings" },
]
