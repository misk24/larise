import ThemeSettingsForm from "@/components/admin/theme-settings-form";
import ThemeSectionsBuilder from "@/components/admin/theme-sections-builder";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { notFound } from "next/navigation";
import { z } from "zod";
import { BackendErrorState, BackendPageHeader, BackendStatusBadge } from "@/components/backend/backend-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";

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
  return (
    <div className="backend-content space-y-6">
      <div className="space-y-3">
        <Link href="/admin/themes" className="inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ChevronLeft aria-hidden="true" className="size-4" />Kembali ke daftar tema
        </Link>
        <BackendPageHeader
          title={theme.name}
          description="Atur struktur section, desain, dan info katalog tema undangan."
          actions={
            <>
              <BackendStatusBadge tone={theme.is_active ? "success" : "neutral"}>{theme.is_active ? "Aktif" : "Nonaktif"}</BackendStatusBadge>
              {theme.is_premium ? <BackendStatusBadge tone="info">Premium</BackendStatusBadge> : null}
              {theme.preview_url ? (
                <Button asChild variant="outline" size="sm">
                  <a href={theme.preview_url} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden="true" />Buka preview<span className="sr-only"> (tab baru)</span></a>
                </Button>
              ) : null}
            </>
          }
        />
      </div>

      {/* Both panels stay mounted so unsaved edits survive switching tabs. */}
      <Tabs defaultValue="sections" className="gap-4">
        <TabsList>
          <TabsTrigger value="sections">Section dan desain</TabsTrigger>
          <TabsTrigger value="info">Info dan katalog</TabsTrigger>
        </TabsList>
        <TabsContent value="sections" forceMount className="data-[state=inactive]:hidden">
          {sectionsError ? (
            <BackendErrorState title="Section tema gagal dimuat" description="Muat ulang halaman untuk mencoba lagi." />
          ) : (
            <ThemeSectionsBuilder themeId={id} initialSections={(sections ?? []) as never} />
          )}
        </TabsContent>
        <TabsContent value="info" forceMount className="data-[state=inactive]:hidden">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle role="heading" aria-level={2} className="text-base">Konfigurasi tema</CardTitle>
              <CardDescription>Informasi, harga, kategori, dan aset pratinjau tema.</CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeSettingsForm theme={{ ...theme, features: Array.isArray(theme.features) ? theme.features as string[] : [] }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
