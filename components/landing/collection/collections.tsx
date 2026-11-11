import { createPublicClient } from "@/lib/supabase/public";
import { unstable_cache } from "next/cache";
import { ThemeShowcase } from "./theme-showcase";

// The catalogue is public and changes rarely, so it is cached for a few minutes
// instead of hitting the database on every landing page request.
const getActiveThemes = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("themes")
      .select("id, name, slug, description, thumbnail_url, preview_url, price, category, features, is_active, is_premium")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(9);

    // Throwing keeps a failed lookup out of the cache; the caller falls back to an empty list.
    if (error) throw new Error(error.message);
    return data ?? [];
  },
  ["landing-active-themes"],
  { revalidate: 300, tags: ["themes"] },
);

export async function ThemeSectionHorizontal() {
  let themes: Awaited<ReturnType<typeof getActiveThemes>> = [];
  try {
    themes = await getActiveThemes();
  } catch (error) {
    // Keep the landing page usable if the theme catalogue is temporarily unavailable.
    console.error("[ThemeSection] Failed to load themes:", error instanceof Error ? error.message : error);
  }

  return <ThemeShowcase themes={themes} />;
}
