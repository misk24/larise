import ThemeSettingsForm from "@/components/admin/theme-settings-form";
import ThemeSectionsBuilder from "@/components/admin/theme-sections-builder";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { notFound } from "next/navigation";
import { z } from "zod";
import { BackendErrorState, BackendPageHeader, BackendStatCard, BackendStatGrid, BackendStatusBadge } from "@/components/backend/backend-ui";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ChevronLeft, Eye, ExternalLink, Layers, Lock, Tag } from "lucide-react";

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
  const list = sections ?? [];
  const price = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(theme.price ?? 0);
  return (
    <div className="backend-content space-y-8">
      <div className="space-y-3">
        <Link href="/admin/themes" className="inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ChevronLeft aria-hidden="true" className="size-4" />Kembali ke daftar tema
        </Link>
        <BackendPageHeader
          title={theme.name}
          description="Atur struktur section, desain, dan informasi katalog tema undangan."
          actions={<>
            <BackendStatusBadge tone={theme.is_active ? "success" : "neutral"}>{theme.is_active ? "Aktif" : "Nonaktif"}</BackendStatusBadge>
            {theme.is_premium ? <BackendStatusBadge tone="info">Premium</BackendStatusBadge> : null}
            {theme.is_active ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/tema/${theme.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden="true" className="size-4" />Lihat di katalog</Link>
              </Button>
            ) : null}
          </>}
        />
      </div>
      <BackendStatGrid aria-label="Ringkasan tema">
        <BackendStatCard icon={Layers} label="Section" value={list.length} />
        <BackendStatCard icon={Eye} label="Tampil" value={list.filter((item) => item.is_visible).length} description={`dari ${list.length} section`} />
        <BackendStatCard icon={Lock} label="Wajib" value={list.filter((item) => item.is_required).length} />
        <BackendStatCard icon={Tag} label="Harga" value={price} />
      </BackendStatGrid>
      {/* Both panels stay mounted so unsaved edits survive switching tabs. */}
      <Tabs defaultValue="sections" className="gap-6">
        <TabsList>
          <TabsTrigger value="sections">Section &amp; desain</TabsTrigger>
          <TabsTrigger value="settings">Info &amp; harga</TabsTrigger>
        </TabsList>
        <TabsContent value="sections" forceMount className="data-[state=inactive]:hidden">
          <p className="mb-4 text-sm text-muted-foreground">Perubahan di sini mengubah template default, bukan konten undangan yang sudah dibuat.</p>
          {sectionsError ? (
            <BackendErrorState title="Section tema gagal dimuat" description="Muat ulang halaman untuk mencoba lagi." />
          ) : (
            <ThemeSectionsBuilder themeId={id} initialSections={list as never} />
          )}
        </TabsContent>
        <TabsContent value="settings" forceMount className="data-[state=inactive]:hidden">
          <ThemeSettingsForm theme={{ ...theme, features: Array.isArray(theme.features) ? theme.features as string[] : [] }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
