import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ThemeActions } from "@/components/admin/theme-actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { PaletteIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminThemesPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: themes, error, count } = await supabase
    .from("themes")
    .select("id,name,slug,category,price,is_active,created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div className="backend-content space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Kelola Tema</h1>
          <p className="text-muted-foreground">Kelola tema undangan yang tersedia untuk pengguna.</p>
        </div>
        <Button asChild>
          <Link href="/admin/themes/create">Buat Tema</Link>
        </Button>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Daftar Tema</CardTitle>
          <CardDescription>{error ? "Jumlah tema tidak dapat dimuat." : `Total ${(count ?? 0).toLocaleString("id-ID")} tema`}</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p role="alert" className="py-8 text-center text-sm text-destructive">Data tema gagal dimuat. Periksa izin baca admin pada database.</p>
          ) : themes?.length ? (
            <div className="backend-table-container">
              <Table>
                <TableHeader className="bg-muted/70">
                  <TableRow>
                    <TableHead>Nama tema</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {themes.map((theme) => (
                    <TableRow key={theme.id}>
                      <TableCell className="min-w-36">
                        <Link href={`/admin/themes/${theme.id}`} className="font-medium hover:text-primary hover:underline">{theme.name}</Link>
                        <p className="text-xs text-muted-foreground">{theme.slug}</p>
                      </TableCell>
                      <TableCell className="capitalize">{theme.category || "—"}</TableCell>
                      <TableCell>{theme.price ? `Rp ${theme.price.toLocaleString("id-ID")}` : "Gratis"}</TableCell>
                      <TableCell>
                        <Badge variant={theme.is_active ? "default" : "secondary"}>{theme.is_active ? "Aktif" : "Nonaktif"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" asChild><Link href={`/admin/themes/${theme.id}`}>Edit</Link></Button>
                          <ThemeActions id={theme.id} active={theme.is_active} name={theme.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <PaletteIcon aria-hidden="true" className="mx-auto mb-4 size-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Belum ada tema.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
