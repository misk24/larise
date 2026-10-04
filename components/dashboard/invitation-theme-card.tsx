"use client";

import { Check, Eye, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";

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

const categoryStyles: Record<string, string> = {
  elegant: "bg-stone-100 text-stone-800",
  minimalist: "bg-slate-100 text-slate-800",
  traditional: "bg-amber-100 text-amber-900",
  modern: "bg-zinc-100 text-zinc-900",
  rustic: "bg-orange-100 text-orange-900",
  floral: "bg-rose-100 text-rose-900",
};

export function InvitationThemeCard({
  theme,
  selected,
  onSelect,
}: {
  theme: Theme;
  selected: boolean;
  onSelect: () => void;
}) {
  const features = Array.isArray(theme.features) ? theme.features.filter((item): item is string => typeof item === "string") : [];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group overflow-hidden rounded-xl border text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border",
      )}
    >
      <div className={cn("relative aspect-[4/3] p-5", categoryStyles[theme.category] ?? "bg-muted")}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,white/70,transparent_35%)]" />
        <div className="relative flex h-full flex-col justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.2em]">{theme.category}</span>
          <div className="text-center">
            <p className="font-serif text-2xl">{theme.name}</p>
            <p className="mt-1 text-xs opacity-70">LARISÉ</p>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>{theme.is_premium ? "Premium" : "Free"}</span>
            {selected ? <Check className="size-5" /> : <Eye className="size-4 opacity-60" />}
          </div>
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium">{theme.name}</p>
          {theme.is_premium && <LockKeyhole className="size-4 text-muted-foreground" />}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{theme.description}</p>
        {features.length > 0 && <p className="text-xs text-muted-foreground">{features.slice(0, 2).join(" • ")}</p>}
      </div>
    </button>
  );
}
