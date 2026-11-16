import { BackendErrorState, BackendPageHeader } from "@/components/backend/backend-ui";
import { AccountForm } from "@/components/dashboard/account-form";
import { LoginSecurityCard } from "@/components/dashboard/login-security-card";
import { AccountDangerZone } from "@/components/dashboard/account-danger-zone";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
      <div className="backend-content mx-auto w-full max-w-4xl space-y-8">
        <BackendPageHeader title="Akun Saya" description="Kelola profil dan akses akun LARISÉ Anda." />
        <BackendErrorState title="Data profil gagal dimuat" description="Muat ulang halaman atau coba beberapa saat lagi." />
      </div>
    );
  }

  const joinedAt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(profile.created_at));

  return (
    <div className="backend-content mx-auto w-full max-w-4xl space-y-8">
      <BackendPageHeader
        title="Akun Saya"
        description={`Kelola informasi profil dan metode login untuk mengakses LARISÉ. Bergabung sejak ${joinedAt}.`}
      />

      <AccountForm user={user} profile={profile} />

      <LoginSecurityCard provider={profile.provider} email={user.email ?? profile.email} />

      <AccountDangerZone provider={profile.provider} email={user.email ?? profile.email} />
    </div>
  );
}
