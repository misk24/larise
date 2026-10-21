import SectionForm from "@/components/admin/section-form";
import { createClient } from "@/lib/supabase/server";

export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: theme } = await supabase
    .from("themes")
    .select("*")
    .eq("id", id)
    .single();

  const { data: sections } = await supabase
    .from("theme_sections")
    .select("*")
    .eq("theme_id", id)
    .order("position");

  return (
    <div className="backend-content grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(220px,1fr)_minmax(0,3fr)]">
      <aside className="backend-surface min-w-0 p-4">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Sections</h1>
        <ul className="space-y-1">
          {sections?.map((s) => (
            <li key={s.id}>{s.section_key}</li>
          ))}
        </ul>
      </aside>

      <section className="backend-surface min-w-0 p-4">
        <div className="text-xl font-semibold">{theme?.name}</div>
        <p className="text-muted-foreground">Theme section builder</p>

        <SectionForm id={id} />
      </section>
    </div>
  );
}
