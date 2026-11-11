"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { offsets, timings } from "@/components/motion/presets";

export type Theme = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  preview_url: string | null;
  price: number;
  category: string;
  features: unknown;
  is_active: boolean;
  is_premium: boolean;
};

export const categoryLabels: Record<string, string> = {
  all: "Semua",
  elegant: "Elegan",
  minimalist: "Minimalis",
  traditional: "Tradisional",
  modern: "Modern",
  rustic: "Rustic",
  floral: "Floral",
};

const categoryColors: Record<string, string> = {
  elegant: "from-[#eadfd3] via-[#f6eee6] to-[#c5a58b]",
  minimalist: "from-[#e9e7df] via-[#f8f7f2] to-[#c9c6b9]",
  traditional: "from-[#d7bda2] via-[#f0e3d2] to-[#9d7151]",
  modern: "from-[#d7dce0] via-[#f3f4f2] to-[#a6b3b8]",
  rustic: "from-[#c8d0bd] via-[#edf0e7] to-[#8c9b7e]",
  floral: "from-[#e6ccd0] via-[#f8eeee] to-[#c49da5]",
};

// Only images from our own Supabase Storage go through the optimizer; other hosts are not allow-listed.
function canOptimize(src: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return Boolean(supabaseUrl) && new URL(src).hostname === new URL(supabaseUrl!).hostname;
  } catch {
    return false;
  }
}

function formatPrice(price: number) {
  if (!price) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ThemeCard({ theme, index }: { theme: Theme; index: number }) {
  const image = theme.thumbnail_url || theme.preview_url;
  const category = theme.category.toLowerCase();
  const features = Array.isArray(theme.features)
    ? theme.features.filter((feature): feature is string => typeof feature === "string")
    : [];

  return (
    // Animates on mount (not on scroll): cards inside the mobile carousel start off-screen.
    <motion.article
      initial={{ opacity: 0, y: offsets.md }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: timings.fast, delay: index * 0.055, ease: "easeOut" }}
      className="w-[86%] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:min-w-0 sm:shrink"
    >
      <Link href={`/tema/${theme.slug}`} className="group block" aria-label={`Lihat pratinjau tema ${theme.name}`}>
        <div
          className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${
            categoryColors[category] ?? "from-[#e8e3d9] via-[#f7f3ec] to-[#c9b9a4]"
          }`}
        >
          {image ? (
            <Image
              src={image}
              alt={`Preview tema ${theme.name}`}
              fill
              unoptimized={!canOptimize(image)}
              sizes="(max-width: 639px) 86vw, (max-width: 1023px) 46vw, 30vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-ink/20 bg-white/30 backdrop-blur-sm">
                <Palette size={23} strokeWidth={1} aria-hidden="true" />
              </div>
              <span className="frontend-display text-2xl sm:text-3xl">{theme.name}</span>
              <span className="mt-3 text-[11px] uppercase tracking-[0.2em] text-ink/70">LARISÉ COLLECTION</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#211c17]/55 via-transparent to-black/5 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

          {theme.is_premium && (
            <span className="absolute left-3 top-3 bg-ink/85 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.12em] text-white backdrop-blur-sm sm:left-4 sm:top-4">
              Premium
            </span>
          )}

          <span className="absolute bottom-4 left-4 right-4 text-[11px] uppercase tracking-[0.18em] text-white/90 sm:bottom-5 sm:left-5 sm:right-5">
            {categoryLabels[category] ?? theme.category}
          </span>
        </div>
      </Link>

      <div className="pt-3 sm:pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="frontend-display truncate text-lg sm:text-xl lg:text-2xl">{theme.name}</h3>
            {theme.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink/70 sm:leading-6">{theme.description}</p>
            )}
          </div>
          <span className="shrink-0 pt-1 text-xs text-gold-deep">{formatPrice(theme.price)}</span>
        </div>

        {features.length > 0 && (
          <div className="mt-3 hidden flex-wrap gap-x-3 gap-y-1.5 sm:flex">
            {features.slice(0, 2).map((feature) => (
              <span key={feature} className="text-xs text-ink/70">
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
