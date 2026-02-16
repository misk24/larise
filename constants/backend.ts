import { AdminNavProps, UserNavProps } from "@/types/backend";
import {
  FileTextIcon,
  ImageIcon,
  LayoutDashboardIcon,
  MessageSquareHeartIcon,
  PaletteIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";

export const adminNavs: AdminNavProps[] = [
  { href: "/admin", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/admin/users", icon: UsersIcon, label: "Users" },
  { href: "/admin/themes", icon: PaletteIcon, label: "Themes" },
  { href: "/admin/orders", icon: ShoppingCartIcon, label: "Orders" },
  { href: "/admin/settings", icon: SettingsIcon, label: "Settings" },
];

export const userNavs: UserNavProps[] = [
  {
    href: "/dashboard",
    icon: LayoutDashboardIcon,
    label: "Dashboard",
  },
  { href: "/dashboard/invitations", icon: FileTextIcon, label: "Invitations" },
  { href: "/dashboard/guests", icon: UsersIcon, label: "Guests" },
  { href: "/dashboard/wishes", icon: MessageSquareHeartIcon, label: "Wishes" },
  { href: "/dashboard/gallery", icon: ImageIcon, label: "Gallery" },
  { href: "/dashboard/settings", icon: SettingsIcon, label: "Settings" },
];

export const subpageNavs: Record<string, string> = {
  create: "Create",
};
