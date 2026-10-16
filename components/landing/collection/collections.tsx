import { createClient } from "@/lib/supabase/server";
import { ThemeShowcase } from "./theme-showcase";

export async function ThemeSectionHorizontal() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("themes")
    .select(
      "id, name, slug, description, thumbnail_url, preview_url, price, category, features, is_active, is_premium",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(9);

  if (error) {
    // Keep the landing page usable if the theme catalogue is temporarily unavailable.
    console.error("[ThemeSection] Failed to load themes:", error.message);
  }

  return <ThemeShowcase themes={data ?? []} />;
}
