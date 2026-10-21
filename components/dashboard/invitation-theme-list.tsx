"use client";

import { CheckCircle2, LockKeyhole, Palette } from "lucide-react";
import { useMemo, useState } from "react";

type Theme = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  features: unknown;
  price: number;
  is_premium: boolean;
};

const categories = [
  { value: "all", label: "Semua" },
  { value: "minimalist", label: "Minimalis" },
  { value: "elegant", label: "Elegan" },
  { value: "modern", label: "Modern" },
  { value: "floral", label: "Floral" },
  { value: "traditional", label: "Tradisional" },
  { value: "rustic", label: "Rustic" },
];

const categoryLabels: Record<string, string> = {
  elegant: "Elegan",
  minimalist: "Minimalis",
  traditional: "Tradisional",
  modern: "Modern",
  rustic: "Rustic",
  floral: "Floral",
};

const categoryStyles: Record<string, string> = {
  elegant: "bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-200",
  minimalist: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
  traditional: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  modern: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200",
  rustic: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  floral: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
};

export function InvitationThemeList({
  themes,
  selectedThemeId,
  onSelect,
}: {
  themes: Theme[];
  selectedThemeId: string;
  onSelect: (themeId: string) => void;
}) {
  const [category, setCategory] = useState("all");
  const filteredThemes = useMemo(
    () => themes.filter((theme) => category === "all" || theme.category === category),
    [category, themes],
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter kategori tema">
        {categories.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setCategory(item.value)}
            aria-pressed={category === item.value}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${category === item.value ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filteredThemes.length} tema tersedia</p>

      {filteredThemes.length ? (
        <div className="divide-y rounded-lg border">
          {filteredThemes.map((theme) => {
            const selected = selectedThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelect(theme.id)}
                aria-pressed={selected}
                className={`flex w-full items-center gap-3 p-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-muted/60 sm:gap-4 sm:p-4 ${selected ? "bg-primary/5" : "bg-card"}`}
              >
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${categoryStyles[theme.category] ?? "bg-muted text-muted-foreground"}`}>
                  <Palette className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium">{theme.name}</span>
                    <span className="text-xs text-muted-foreground">{categoryLabels[theme.category] ?? theme.category}</span>
                    {theme.is_premium ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                        <LockKeyhole className="size-3" /> Premium
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">Gratis</span>
                    )}
                  </span>
                  {theme.description ? (
                    <span className="mt-1 block line-clamp-2 text-sm text-muted-foreground">{theme.description}</span>
                  ) : null}
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium">
                  {theme.is_premium ? (
                    <span className="hidden text-muted-foreground sm:inline">
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(theme.price)}
                    </span>
                  ) : null}
                  {selected ? <CheckCircle2 className="size-5 text-primary" /> : <span className="size-5 rounded-full border" />}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Tidak ada tema pada kategori ini.
        </div>
      )}
    </div>
  );
}
