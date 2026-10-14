import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { FileTextIcon, PaletteIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [usersResult, invitationsResult, publishedResult, themesResult, recentUsersResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "user"),
    supabase.from("invitations").select("id", { count: "exact", head: true }),
    supabase.from("invitations").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("themes").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id,full_name,email,created_at").eq("role", "user").order("created_at", { ascending: false }).limit(5),
  ]);
  const metrics = [
    { label: "Pengguna", value: usersResult.count ?? 0, detail: "Akun pengguna", href: "/admin/users", icon: UsersIcon },
    { label: "Total undangan", value: invitationsResult.count ?? 0, detail: "Semua status", href: "/admin/invitations", icon: FileTextIcon },
    { label: "Undangan terbit", value: publishedResult.count ?? 0, detail: "Status published", href: "/admin/invitations?status=published", icon: FileTextIcon },
    { label: "Tema", value: themesResult.count ?? 0, detail: "Aktif dan nonaktif", href: "/admin/themes", icon: PaletteIcon },
  ];
  const failed = [usersResult.error, invitationsResult.error, publishedResult.error, themesResult.error].some(Boolean);
  return <div className="space-y-6">
    <div><h1 className="text-2xl md:text-3xl font-medium">Ringkasan Admin</h1><p className="text-muted-foreground">Pantau kondisi platform berdasarkan data database saat ini.</p></div>
    {failed ? <p role="alert" className="text-sm text-destructive">Sebagian metrik gagal dimuat. Periksa izin akses admin pada database.</p> : null}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(metric => <Link key={metric.label} href={metric.href} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Card className="h-full transition-colors hover:bg-muted/40"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{metric.label}</CardTitle><metric.icon className="size-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-semibold tabular-nums">{metric.value}</div><p className="text-xs text-muted-foreground">{metric.detail}</p></CardContent></Card></Link>)}</div>
    <Card className="border-border bg-sidebar"><CardHeader><CardTitle>Pengguna terbaru</CardTitle><CardDescription>Lima akun pengguna terbaru</CardDescription></CardHeader><CardContent>
      {recentUsersResult.error ? <p role="alert" className="text-sm text-destructive">Data pengguna gagal dimuat.</p> : recentUsersResult.data?.length ? <div className="divide-y divide-border">{recentUsersResult.data.map(user => <div key={user.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{user.full_name || "Tanpa nama"}</p><p className="text-sm text-muted-foreground">{user.email || "Email tidak tersedia"}</p></div><p className="text-xs text-muted-foreground">{new Date(user.created_at).toLocaleDateString("id-ID")}</p></div>)}</div> : <p className="py-8 text-center text-muted-foreground">Belum ada pengguna.</p>}
      <Link href="/admin/users" className="mt-4 inline-block text-sm text-primary hover:underline">Lihat semua pengguna</Link>
    </CardContent></Card>
  </div>;
}
