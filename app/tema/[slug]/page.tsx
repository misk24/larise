import { SharedInvitationRenderer } from "@/components/invitation/shared-renderer";
import { previewInvitation } from "@/lib/preview-invitation";
import { createPublicClient } from "@/lib/supabase/public";
import type { InvitationSection, Theme } from "@/types/database";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadTheme(slug: string) {
  const supabase = createPublicClient();
  const { data: theme } = await supabase
    .from("themes")
    .select("id, name, slug, description, thumbnail_url, preview_url, price, category, features, is_active, is_premium, created_at, updated_at")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (!theme) return null;

  const { data: sections } = await supabase
    .from("theme_sections")
    .select("id, section_key, section_type, position, default_content, is_visible")
    .eq("theme_id", theme.id)
    .order("position");

  return { theme: theme as Theme, sections: sections ?? [] };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadTheme(slug);
  if (!result) return { title: "Tema Tidak Ditemukan", robots: { index: false, follow: false } };
  return {
    title: `Tema ${result.theme.name} | LARISÉ`,
    description: result.theme.description ?? `Lihat pratinjau tema undangan ${result.theme.name} dari LARISÉ.`,
  };
}

export default async function ThemePreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await loadTheme(slug);
  if (!result) notFound();

  const sections: InvitationSection[] = result.sections.map((section) => ({
    id: section.id,
    invitation_id: previewInvitation.id,
    section_key: section.section_key,
    section_type: section.section_type,
    position: section.position,
    content: (section.default_content ?? {}) as Record<string, unknown>,
    is_visible: section.is_visible,
    created_at: previewInvitation.created_at,
    updated_at: previewInvitation.updated_at,
  }));

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-[#29271F]/10 bg-[#F8F6F1]/95 px-4 py-3 text-[#29271F] backdrop-blur">
        <Link href="/#collections" className="text-sm underline-offset-4 hover:underline">← Semua tema</Link>
        <p className="hidden text-sm sm:block">Pratinjau tema <strong className="font-semibold">{result.theme.name}</strong> dengan contoh data</p>
        <Link href="/register" className="inline-flex min-h-9 items-center rounded-[4px] border border-[#29271F] bg-[#29271F] px-4 text-xs font-medium text-[#FAF8F3] transition-colors hover:bg-[#51483B]">
          Pakai tema ini
        </Link>
      </div>
      <SharedInvitationRenderer invitation={previewInvitation} sections={sections} guestName="Tamu Undangan" guestToken={null} wishes={[]} />
    </>
  );
}
