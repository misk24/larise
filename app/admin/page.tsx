import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackendEmptyState, BackendPageHeader, BackendStatCard, BackendStatusBadge } from "@/components/backend/backend-ui";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { FileTextIcon, PaletteIcon, UsersIcon } from "lucide-react";
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
      icon: FileTextIcon,
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
    <div className="backend-content space-y-6">
      <BackendPageHeader title="Ringkasan Admin" description="Pantau kondisi platform berdasarkan data database saat ini." />

      {metricErrors.length > 0 ? (
        <p role="alert" className="text-sm text-destructive">
          Sebagian statistik gagal dimuat. Nilai yang tidak tersedia tidak ditampilkan sebagai nol.
        </p>
      ) : null}

      <section aria-label="Statistik platform" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, href, icon }) => (
          <BackendStatCard key={label} label={label} value={value === null ? "—" : value.toLocaleString("id-ID")} description={detail} href={href} icon={icon} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Pengguna terbaru</CardTitle>
            <CardDescription>Lima akun pengguna yang terakhir terdaftar.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsersResult.error ? (
              <p role="alert" className="py-6 text-sm text-destructive">Data pengguna gagal dimuat. Periksa izin akses database.</p>
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
            <Link href="/admin/users" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
              Lihat semua pengguna
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Undangan terbaru</CardTitle>
            <CardDescription>Lima undangan yang terakhir dibuat.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentInvitationsResult.error ? (
              <p role="alert" className="py-6 text-sm text-destructive">Data undangan gagal dimuat. Periksa izin akses database.</p>
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
                        <BackendStatusBadge tone={invitation.status === "published" ? "success" : invitation.status === "draft" ? "neutral" : invitation.status === "unpublished" ? "warning" : "info"}>{invitation.status}</BackendStatusBadge>
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
            <Link href="/admin/invitations" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
              Lihat semua undangan
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
