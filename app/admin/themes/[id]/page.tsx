import SectionForm from "@/components/admin/section-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { notFound } from "next/navigation";
import { z } from "zod";

export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();

  if (!z.string().uuid().safeParse(id).success) notFound();

  const supabase = createAdminClient();
  const { data: theme, error: themeError } = await supabase
    .from("themes")
    .select("id,name")
    .eq("id", id)
    .maybeSingle();

  if (themeError || !theme) notFound();

  const { data: sections, error: sectionsError } = await supabase
    .from("theme_sections")
    .select("id,section_key,position")
    .eq("theme_id", id)
    .order("position");

  return (
    <div className="backend-content grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(220px,1fr)_minmax(0,3fr)]">
      <aside className="backend-surface min-w-0 space-y-4 p-4 sm:p-5">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Sections</h1>
        {sectionsError ? (
          <p role="alert" className="text-sm text-destructive">Daftar section gagal dimuat. Muat ulang halaman untuk mencoba lagi.</p>
        ) : (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {sections?.map((section) => (
              <li key={section.id} className="rounded-md bg-muted/60 px-3 py-2">{section.section_key}</li>
            ))}
            {!sections?.length && <li className="text-muted-foreground">Belum ada section.</li>}
          </ul>
        )}
      </aside>

      <section className="backend-surface min-w-0 space-y-4 p-4 sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight">{theme.name}</h2>
        <p className="text-muted-foreground">Theme section builder</p>
        <SectionForm id={id} />
      </section>
    </div>
  );
}
