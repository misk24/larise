import { AccountForm } from "@/components/dashboard/account-form";
import { LoginSecurityCard } from "@/components/dashboard/login-security-card";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CalendarDaysIcon, ShieldCheckIcon } from "lucide-react";

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
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">My Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Kelola profil dan akses akun LARISÉ Anda.</p>
        </div>
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
    <div className="mx-auto w-full max-w-4xl space-y-7">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Account</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">My Account</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Kelola informasi profil dan metode login yang digunakan untuk mengakses LARISÉ.
        </p>
      </div>

      <AccountForm user={user} profile={profile} />

      <LoginSecurityCard provider={profile.provider} email={user.email ?? profile.email} />

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="shadow-none">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <ShieldCheckIcon className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium">Metode login</p>
              <p className="text-sm text-muted-foreground">
                {profile.provider === "google" ? "Google" : "Email dan password"}
              </p>
              <p className="text-xs leading-5 text-muted-foreground">
                {profile.provider === "google"
                  ? "Gunakan akun Google yang terhubung untuk masuk."
                  : "Gunakan email dan password untuk masuk ke akun Anda."}
              </p>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
}
