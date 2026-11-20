/** Kategori tema. Nilainya harus sama dengan enum di `app/api/admin/themes/[id]/route.ts`. */
export const THEME_CATEGORIES = [
  { value: "elegant", label: "Elegan" },
  { value: "minimalist", label: "Minimalis" },
  { value: "traditional", label: "Tradisional" },
  { value: "modern", label: "Modern" },
  { value: "rustic", label: "Rustic" },
  { value: "floral", label: "Floral" },
] as const;

export function themeCategoryLabel(value: string | null | undefined): string {
  return THEME_CATEGORIES.find((item) => item.value === value)?.label ?? (value || "—");
}
