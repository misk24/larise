import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { FileTextIcon, PaletteIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

function formatDate(value: string | null) {
  if (!value) return "Tanggal tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

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
        .select("id,title,slug,status,created_at,profiles(full_name,email)")
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
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Ringkasan Admin</h1>
        <p className="text-muted-foreground">Pantau kondisi platform berdasarkan data database saat ini.</p>
      </header>

      {metricErrors.length > 0 ? (
        <p role="alert" className="text-sm text-destructive">
          Sebagian statistik gagal dimuat. Nilai yang tidak tersedia tidak ditampilkan sebagai nol.
        </p>
      ) : null}

      <section aria-label="Statistik platform" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card className="h-full shadow-none transition-colors hover:bg-muted/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tabular-nums">{value === null ? "—" : value.toLocaleString("id-ID")}</p>
                <p className="text-xs text-muted-foreground">{detail}</p>
              </CardContent>
            </Card>
          </Link>
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
              <p className="py-8 text-center text-sm text-muted-foreground">Belum ada pengguna.</p>
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
                        <p className="truncate text-sm font-medium">{invitation.title || invitation.slug}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {owner?.full_name || owner?.email || "Pemilik tidak diketahui"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize text-muted-foreground">
                          {invitation.status}
                        </span>
                        <time dateTime={invitation.created_at} className="text-xs text-muted-foreground">
                          {formatDate(invitation.created_at)}
                        </time>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">Belum ada undangan.</p>
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
