import {
  CalendarCheckIcon,
  FileTextIcon,
  ImageIcon,
  LayoutDashboardIcon,
  MessageSquareHeartIcon,
  PaletteIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";

export const adminNavs = [
  { href: "/admin", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/admin/users", icon: UsersIcon, label: "Pengguna" },
  { href: "/admin/themes", icon: PaletteIcon, label: "Tema" },
  { href: "/admin/orders", icon: ShoppingCartIcon, label: "Pesanan" },
  { href: "/admin/settings", icon: SettingsIcon, label: "Pengaturan" },
];

export const userNavs = [
  { href: "/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/dashboard/invitations", icon: FileTextIcon, label: "Undangan Saya" },
  { href: "/dashboard/guests", icon: UsersIcon, label: "Daftar Tamu" },
  { href: "/dashboard/rsvp", icon: CalendarCheckIcon, label: "RSVP" },
  { href: "/dashboard/wishes", icon: MessageSquareHeartIcon, label: "Ucapan & Doa" },
  { href: "/dashboard/gallery", icon: ImageIcon, label: "Galeri Foto" },
  { href: "/dashboard/settings", icon: SettingsIcon, label: "Pengaturan" },
];

export const subpageNavs: Record<string, string> = {
  create: "Buat Undangan",
};
