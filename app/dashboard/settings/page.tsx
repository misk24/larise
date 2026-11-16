import { BackendPageHeader, BackendStatusBadge } from "@/components/backend/backend-ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { BellIcon, FileTextIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const settingsItems = [
  {
    title: "Preferensi Undangan",
    description: "Kelola detail acara, RSVP, galeri, backsound, dan informasi lainnya dari masing-masing undangan.",
    href: "/dashboard/invitations",
    label: "Buka undangan",
    icon: FileTextIcon,
    disabled: false,
  },
  {
    title: "Notifikasi",
    description: "Preferensi notifikasi akan tersedia ketika notifikasi email dan aktivitas sudah didukung oleh aplikasi.",
    href: "/dashboard/settings",
    label: "Dalam pengembangan",
    icon: BellIcon,
    disabled: true,
  },
  {
    title: "Privasi & Keamanan",
    description: "Kelola informasi profil dan metode login melalui halaman Akun Saya.",
    href: "/dashboard/account",
    label: "Kelola akun",
    icon: ShieldCheckIcon,
    disabled: false,
  },
];

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="backend-content mx-auto w-full max-w-4xl space-y-8">
      <BackendPageHeader title="Pengaturan" description="Pengaturan aplikasi dan undangan Anda. Pengaturan yang spesifik untuk acara tetap dikelola dari halaman undangan masing-masing." />

      <Card className="gap-0 overflow-hidden py-0">
        <ul className="divide-y">
          {settingsItems.map((item) => (
            <li key={item.title} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
              <item.icon aria-hidden="true" className="hidden size-5 shrink-0 text-muted-foreground sm:block" />
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="text-base font-medium">{item.title}</h2>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              {item.disabled ? (
                <BackendStatusBadge className="self-start sm:self-center">{item.label}</BackendStatusBadge>
              ) : (
                <Button variant="outline" size="sm" asChild className="self-start sm:self-center">
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
