"use client";

import {
  FileTextIcon,
  ImageIcon,
  LayoutDashboardIcon,
  MessageSquareHeartIcon,
  PaletteIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

export const adminNavs = [
  { href: "/admin", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/admin/users", icon: UsersIcon, label: "Users" },
  { href: "/admin/themes", icon: PaletteIcon, label: "Themes" },
  { href: "/admin/orders", icon: ShoppingCartIcon, label: "Orders" },
  { href: "/admin/settings", icon: SettingsIcon, label: "Settings" },
];

export const userNavs = [
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

export const navs = [
  { href: "/test-admin", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/test-admin/users", icon: UsersIcon, label: "Users" },
  { href: "/test-admin/themes", icon: PaletteIcon, label: "Themes" },
  { href: "/test-admin/orders", icon: ShoppingCartIcon, label: "Orders" },
];

export const users = [
  {
    href: "/test-user",
    icon: LayoutDashboardIcon,
    label: "Dashboard",
  },
  { href: "/test-user/invitations", icon: FileTextIcon, label: "Invitations" },
  { href: "/test-user/guests", icon: UsersIcon, label: "Guests" },
  { href: "/test-user/wishes", icon: MessageSquareHeartIcon, label: "Wishes" },
  { href: "/test-user/gallery", icon: ImageIcon, label: "Gallery" },
];

export const adminProfile = [
  { href: "/test-admin/account", icon: UserIcon, label: "My Account" },
  { href: "/test-admin/settings", icon: SettingsIcon, label: "Settings" },
];

export const userProfile = [
  { href: "/test-user/account", icon: UserIcon, label: "My Account" },
  { href: "/test-user/settings", icon: SettingsIcon, label: "Settings" },
];
