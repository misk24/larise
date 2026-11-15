"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Palette } from "lucide-react";
import { FadeUp } from "@/components/motion";
import { Container } from "@/components/landing/ui/container";
import { categoryLabels, ThemeCard, type Theme } from "./theme-card";

export function ThemeShowcase({ themes }: { themes: Theme[] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    const used = new Set(themes.map((theme) => theme.category.toLowerCase()));
    return ["all", ...Object.keys(categoryLabels).filter((category) => category !== "all" && used.has(category))];
  }, [themes]);

  const filteredThemes = useMemo(
    () =>
      activeCategory === "all"
        ? themes
        : themes.filter((theme) => theme.category.toLowerCase() === activeCategory),
    [activeCategory, themes],
  );

  return (
    <section id="collections" className="bg-paper py-24 text-fg sm:py-32 lg:py-40">
      <Container>
        <FadeUp>
          <div className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="frontend-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] tracking-[-0.05em] text-balance">
                Tema yang terasa
                <br className="hidden sm:block" /> seperti ceritamu.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-fg/72 sm:text-base">
                Dari yang sederhana hingga penuh detail, temukan desain yang paling pas untuk merayakan kisah kalian.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex w-fit border-b border-fg/25 pb-2 text-sm transition-colors hover:border-gold hover:text-gold-deep"
            >
              Jelajahi semua tema
            </Link>
          </div>
        </FadeUp>

        {themes.length > 0 ? (
          <>
            <div
              className="mb-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label="Filter kategori tema"
            >
              {categories.map((category) => {
                const selected = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={selected}
                    className={`min-h-10 shrink-0 rounded-[4px] border px-4 text-xs transition-colors duration-200 sm:px-5 ${
                      selected
                        ? "border-fg bg-fg text-background"
                        : "border-fg/15 bg-transparent text-fg/72 hover:border-gold hover:text-fg"
                    }`}
                  >
                    {categoryLabels[category] ?? category}
                  </button>
                );
              })}
            </div>

            <div className="mb-3 flex items-center justify-between text-xs text-fg/70 sm:hidden">
              <span>Geser untuk melihat tema lainnya</span>
              <ChevronRight size={15} aria-hidden="true" />
            </div>

            <div
              role="region"
              aria-label="Koleksi tema. Pada layar kecil, geser horizontal untuk melihat tema lainnya."
              tabIndex={0}
              className="flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-deep [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible sm:pb-0 sm:focus-visible:outline-none lg:grid-cols-3 lg:gap-x-7"
            >
              {filteredThemes.map((theme, index) => (
                <ThemeCard key={theme.id} theme={theme} index={index} />
              ))}
            </div>
          </>
        ) : (
          <div className="border-y border-fg/15 py-16 text-center sm:py-24">
            <Palette className="mx-auto mb-4 text-gold-deep" size={28} aria-hidden="true" />
            <h3 className="frontend-display text-2xl">Koleksi sedang disiapkan</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-fg/70">
              Tema undangan akan tampil di sini setelah tersedia. Silakan kembali lagi sebentar.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
