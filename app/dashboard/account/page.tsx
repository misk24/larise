import { BackendPageHeader } from "@/components/backend/backend-ui";
import { AccountForm } from "@/components/dashboard/account-form";
import { LoginSecurityCard } from "@/components/dashboard/login-security-card";
import { AccountDangerZone } from "@/components/dashboard/account-danger-zone";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CalendarDaysIcon } from "lucide-react";

export default async function MyAccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, provider, full_name, phone, avatar_url, role, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return (
      <div className="backend-content mx-auto w-full max-w-4xl space-y-6">
        <BackendPageHeader title="My Account" description="Kelola profil dan akses akun LARISÉ Anda." />
        <Card className="shadow-none">
          <CardContent className="p-6 text-sm text-destructive">
            Data profil belum dapat dimuat. Muat ulang halaman atau coba beberapa saat lagi.
          </CardContent>
        </Card>
      </div>
    );
  }

  const joinedAt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(profile.created_at));

  return (
    <div className="backend-content mx-auto w-full max-w-4xl space-y-7">
      <BackendPageHeader title="My Account" description="Kelola informasi profil dan metode login yang digunakan untuk mengakses LARISÉ." />

      <AccountForm user={user} profile={profile} />

      <LoginSecurityCard provider={profile.provider} email={user.email ?? profile.email} />

      <div className="max-w-md">
        <Card className="shadow-none">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <CalendarDaysIcon className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium">Bergabung sejak</p>
              <p className="text-sm text-muted-foreground">{joinedAt}</p>
              <p className="text-xs leading-5 text-muted-foreground">
                Informasi ini berasal dari tanggal pembuatan akun.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AccountDangerZone provider={profile.provider} email={user.email ?? profile.email} />
    </div>
  );
}
