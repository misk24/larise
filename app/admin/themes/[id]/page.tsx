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
    <div className="grid grid-cols-4 gap-6">
      <aside className="col-span-1 border p-4">
        <div className="text-2xl md:text-3xl font-medium">Sections</div>
        <ul className="space-y-1">
          {sections?.map((s) => (
            <li key={s.id}>{s.section_key}</li>
          ))}
        </ul>
      </aside>

      <main className="col-span-3 border p-4">
        <div className="text-xl font-semibold">{theme?.name}</div>
        <p className="text-muted-foreground">Theme section builder</p>

        <SectionForm id={id} />
      </main>
    </div>
  );
}
