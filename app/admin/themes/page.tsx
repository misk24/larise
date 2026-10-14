import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { ThemeActions } from "@/components/admin/theme-actions";
import { PaletteIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminThemesPage() {
  const supabase = await createClient();
  const { data: themes, error } = await supabase.from("themes").select("*").order("created_at", { ascending: false });
  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl md:text-3xl font-medium">Kelola Tema</h1><p className="text-muted-foreground">Nonaktifkan tema untuk menghentikan pemilihan baru tanpa merusak undangan lama.</p></div>
      <Button asChild><Link href="/admin/themes/create">Buat Tema</Link></Button></div>
    <Card className="border-border bg-sidebar"><CardHeader><CardTitle>Daftar Tema</CardTitle><CardDescription>{themes?.length ?? 0} tema</CardDescription></CardHeader><CardContent>
      {error ? <p role="alert" className="text-sm text-destructive">Daftar tema gagal dimuat. Periksa izin database.</p> : themes?.length ? <div className="overflow-x-auto rounded-lg border"><Table><TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Kategori</TableHead><TableHead>Harga</TableHead><TableHead>Status</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader><TableBody>
        {themes.map(theme => <TableRow key={theme.id}><TableCell className="font-medium"><Link className="hover:underline" href={`/admin/themes/${theme.id}`}>{theme.name}</Link></TableCell><TableCell>{theme.category || "-"}</TableCell><TableCell>{theme.price ? `Rp ${theme.price.toLocaleString("id-ID")}` : "Gratis"}</TableCell><TableCell><Badge variant={theme.is_active ? "default" : "secondary"}>{theme.is_active ? "Aktif" : "Nonaktif"}</Badge></TableCell><TableCell><ThemeActions id={theme.id} active={theme.is_active} name={theme.name} /></TableCell></TableRow>)}
      </TableBody></Table></div> : <div className="py-12 text-center"><PaletteIcon className="mx-auto mb-4 size-12 text-muted-foreground/50"/><p className="text-muted-foreground">Belum ada tema</p></div>}
    </CardContent></Card>
  </div>;
}
