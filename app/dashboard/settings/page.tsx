import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ArrowUpRightIcon, BellIcon, FileTextIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const settingsItems = [
  {
    title: "Preferensi undangan",
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
    title: "Privasi dan keamanan",
    description: "Kelola informasi profil dan metode login melalui halaman My Account.",
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
    <div className="mx-auto w-full max-w-4xl space-y-7">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Preferences</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Settings</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Pengaturan aplikasi dan undangan Anda. Pengaturan yang spesifik untuk acara tetap dikelola dari halaman undangan masing-masing.
        </p>
      </div>

      <div className="grid gap-4">
        {settingsItems.map((item) => (
          <Card key={item.title} className="shadow-none">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-5 sm:p-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                <item.icon className="size-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription className="text-sm leading-6">{item.description}</CardDescription>
                {item.disabled ? (
                  <span className="inline-flex pt-2 text-xs font-medium text-muted-foreground">{item.label}</span>
                ) : (
                  <Link href={item.href} className="inline-flex items-center gap-1 pt-2 text-sm font-medium text-foreground underline-offset-4 hover:underline">
                    {item.label}
                    <ArrowUpRightIcon className="size-3.5" />
                  </Link>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
