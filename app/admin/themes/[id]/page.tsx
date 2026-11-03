import ThemeSettingsForm from "@/components/admin/theme-settings-form";
import ThemeSectionsBuilder from "@/components/admin/theme-sections-builder";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { notFound } from "next/navigation";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ThemeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) notFound();
  const supabase = createAdminClient();
  const [{ data: theme, error: themeError }, { data: sections, error: sectionsError }] = await Promise.all([
    supabase.from("themes").select("id,name,slug,description,thumbnail_url,preview_url,price,category,features,is_active,is_premium").eq("id",id).maybeSingle(),
    supabase.from("theme_sections").select("id,section_key,section_type,position,default_content,is_required,is_visible").eq("theme_id",id).order("position"),
  ]);
  if (themeError || !theme) notFound();
  return <div className="backend-content space-y-6">
    <div className="space-y-2"><Link href="/admin/themes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4"/>Kembali ke daftar tema</Link><div><h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{theme.name}</h1><p className="mt-1 text-muted-foreground">Atur konfigurasi visual dan struktur konten tema undangan.</p></div></div>
    <Card className="shadow-none"><CardHeader><CardTitle>Konfigurasi tema</CardTitle><CardDescription>Informasi, harga, kategori, dan aset pratinjau tema.</CardDescription></CardHeader><CardContent><ThemeSettingsForm theme={{...theme,features:Array.isArray(theme.features)?theme.features as string[]:[]}}/></CardContent></Card>
    <Card className="shadow-none"><CardHeader><CardTitle>Theme section builder</CardTitle><CardDescription>Kelola isi, visibilitas, dan urutan section. Perubahan di sini mengubah template default, bukan konten undangan yang sudah dibuat.</CardDescription></CardHeader><CardContent>{sectionsError?<p role="alert" className="text-sm text-destructive">Section tema gagal dimuat. Muat ulang halaman untuk mencoba lagi.</p>:<ThemeSectionsBuilder themeId={id} initialSections={(sections??[]) as never}/>}</CardContent></Card>
  </div>;
}
