import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackendEmptyState, BackendErrorState, BackendPageHeader, BackendStatCard, BackendStatGrid } from "@/components/backend/backend-ui";
import { InvitationStatusBadge } from "@/components/backend/invitation-meta";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { EyeIcon, FileTextIcon, PaletteIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

function formatDate(value: string | null) {
  if (!value) return "Tanggal tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const [usersResult, invitationsResult, publishedResult, themesResult, recentUsersResult, recentInvitationsResult] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "user"),
      supabase.from("invitations").select("id", { count: "exact", head: true }),
      supabase.from("invitations").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("themes").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("id,full_name,email,created_at")
        .eq("role", "user")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("invitations")
        .select("id,groom_name,bride_name,slug,status,created_at,profiles(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const metrics = [
    {
      label: "Pengguna",
      value: usersResult.error ? null : usersResult.count ?? 0,
      detail: "Akun pengguna terdaftar",
      href: "/admin/users",
      icon: UsersIcon,
    },
    {
      label: "Total undangan",
      value: invitationsResult.error ? null : invitationsResult.count ?? 0,
      detail: "Semua status",
      href: "/admin/invitations",
      icon: FileTextIcon,
    },
    {
      label: "Undangan terbit",
      value: publishedResult.error ? null : publishedResult.count ?? 0,
      detail: "Status published",
      href: "/admin/invitations?status=published",
      icon: EyeIcon,
    },
    {
      label: "Tema",
      value: themesResult.error ? null : themesResult.count ?? 0,
      detail: "Aktif dan nonaktif",
      href: "/admin/themes",
      icon: PaletteIcon,
    },
  ];

  const metricErrors = [usersResult.error, invitationsResult.error, publishedResult.error, themesResult.error].filter(Boolean);

  return (
    <div className="backend-content space-y-8">
      <BackendPageHeader title="Ringkasan Admin" description="Pantau kondisi platform berdasarkan data database saat ini." />

      {metricErrors.length > 0 ? (
        <BackendErrorState
          title="Sebagian statistik gagal dimuat"
          description="Nilai yang tidak tersedia ditampilkan sebagai tanda hubung, bukan nol."
        />
      ) : null}

      <BackendStatGrid aria-label="Statistik platform">
        {metrics.map(({ label, value, detail, href, icon }) => (
          <BackendStatCard key={label} label={label} value={value === null ? "—" : value.toLocaleString("id-ID")} description={detail} href={href} icon={icon} />
        ))}
      </BackendStatGrid>

      <section aria-label="Aktivitas terbaru" className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle role="heading" aria-level={2} className="text-base">Pengguna terbaru</CardTitle>
            <CardDescription>Lima akun pengguna yang terakhir terdaftar.</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild><Link href="/admin/users">Lihat semua</Link></Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {recentUsersResult.error ? (
              <BackendErrorState title="Data pengguna gagal dimuat" description="Periksa izin akses database, lalu muat ulang halaman." />
            ) : recentUsersResult.data?.length ? (
              <ul className="divide-y divide-border">
                {recentUsersResult.data.map((user) => (
                  <li key={user.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.full_name || "Tanpa nama"}</p>
                      <p className="truncate text-sm text-muted-foreground">{user.email || "Email tidak tersedia"}</p>
                    </div>
                    <time dateTime={user.created_at} className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(user.created_at)}
                    </time>
                  </li>
                ))}
              </ul>
            ) : (
              <BackendEmptyState title="Belum ada pengguna" description="Pengguna yang mendaftar akan muncul di sini." className="min-h-36 border-0 bg-transparent py-6" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle role="heading" aria-level={2} className="text-base">Undangan terbaru</CardTitle>
            <CardDescription>Lima undangan yang terakhir dibuat.</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild><Link href="/admin/invitations">Lihat semua</Link></Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {recentInvitationsResult.error ? (
              <BackendErrorState title="Data undangan gagal dimuat" description="Periksa izin akses database, lalu muat ulang halaman." />
            ) : recentInvitationsResult.data?.length ? (
              <ul className="divide-y divide-border">
                {recentInvitationsResult.data.map((invitation) => {
                  const owner = Array.isArray(invitation.profiles) ? invitation.profiles[0] : invitation.profiles;
                  return (
                    <li key={invitation.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{invitation.groom_name} & {invitation.bride_name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {owner?.full_name || owner?.email || "Pemilik tidak diketahui"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <InvitationStatusBadge status={invitation.status} />
                        <time dateTime={invitation.created_at} className="text-xs text-muted-foreground">
                          {formatDate(invitation.created_at)}
                        </time>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <BackendEmptyState title="Belum ada undangan" description="Undangan yang dibuat pengguna akan muncul di sini." className="min-h-36 border-0 bg-transparent py-6" />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
