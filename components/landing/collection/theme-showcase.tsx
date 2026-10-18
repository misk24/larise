"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, Palette } from "lucide-react";

type Theme = {
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

const categoryLabels: Record<string, string> = {
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

function formatPrice(price: number) {
  if (!price) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ThemeShowcase({ themes }: { themes: Theme[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const categories = useMemo(() => {
    const used = new Set(themes.map((theme) => theme.category.toLowerCase()));
    return [
      "all",
      ...Object.keys(categoryLabels).filter(
        (category) => category !== "all" && used.has(category),
      ),
    ];
  }, [themes]);

  const filteredThemes = useMemo(
    () =>
      activeCategory === "all"
        ? themes
        : themes.filter(
            (theme) => theme.category.toLowerCase() === activeCategory,
          ),
    [activeCategory, themes],
  );

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.set([".theme-heading", ".theme-card"], {
          clearProps: "all",
        });
        return;
      }

      gsap.fromTo(
        ".theme-heading",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(".theme-card", { clearProps: "all" });
      return;
    }

    const cards = gridRef.current.querySelectorAll(".theme-card");
    gsap.killTweensOf(cards);

    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        stagger: 0.055,
        ease: "power2.out",
        clearProps: "opacity,visibility,transform",
      },
    );
  }, [filteredThemes]);

  return (
    <section
      id="collections"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F8F6F1] py-20 text-[#29271F] sm:py-28 lg:py-36"
    >
      <div className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full bg-[#d9c4a8]/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#c9d0c1]/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="theme-heading mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#A58A67]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#927653]">
                The collection
              </span>
            </div>
            <h2 className="font-serif text-4xl leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Tema yang terasa
              <br className="hidden sm:block" /> seperti <em>ceritamu.</em>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#29271F]/65 sm:text-base">
              Dari yang sederhana hingga penuh detail, temukan desain yang
              paling pas untuk merayakan kisah kalian.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex w-fit border-b border-[#29271F]/25 pb-2 text-sm transition-colors hover:border-[#A58A67] hover:text-[#927653]"
          >
            Jelajahi semua tema
          </Link>
        </div>

        {themes.length > 0 ? (
          <>
            <div
              className="mb-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                    className={`shrink-0 rounded-[4px] border px-4 py-2 text-xs transition-colors duration-200 sm:px-5 sm:py-2.5 ${
                      selected
                        ? "border-[#29271F] bg-[#29271F] text-[#F8F6F1]"
                        : "border-[#29271F]/15 bg-transparent text-[#29271F]/65 hover:border-[#A58A67] hover:text-[#29271F]"
                    }`}
                  >
                    {categoryLabels[category] ?? category}
                  </button>
                );
              })}
            </div>

            <div className="mb-3 flex items-center justify-between text-[11px] text-[#29271F]/55 sm:hidden">
              <span>Geser untuk melihat tema lainnya</span>
              <ChevronRight size={15} aria-hidden="true" />
            </div>

            <div
              ref={gridRef}
              role="region"
              aria-label="Koleksi tema. Pada layar kecil, geser horizontal untuk melihat tema lainnya."
              tabIndex={0}
              className="flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927653] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible sm:pb-0 sm:focus-visible:outline-none lg:grid-cols-3 lg:gap-x-7"
            >
              {filteredThemes.map((theme, index) => {
                const image = theme.thumbnail_url || theme.preview_url;
                const category = theme.category.toLowerCase();
                const features = Array.isArray(theme.features)
                  ? theme.features.filter(
                      (feature): feature is string =>
                        typeof feature === "string",
                    )
                  : [];

                return (
                  <article
                    key={theme.id}
                    className="theme-card w-[86%] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink sm:min-w-0"
                  >
                    <Link
                      href="/register"
                      className="group block"
                      aria-label={`Pilih tema ${theme.name}`}
                    >
                      <div
                        className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${
                          categoryColors[category] ??
                          "from-[#e8e3d9] via-[#f7f3ec] to-[#c9b9a4]"
                        }`}
                      >
                        {image ? (
                          <Image
                            src={image}
                            alt={`Preview tema ${theme.name}`}
                            fill
                            unoptimized
                            sizes="(max-width: 639px) 86vw, (max-width: 1023px) 46vw, 30vw"
                            priority={index < 2}
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-[#29271F]/20 bg-white/30 backdrop-blur-sm">
                              <Palette size={23} strokeWidth={1} />
                            </div>
                            <span className="font-serif text-2xl italic sm:text-3xl">
                              {theme.name}
                            </span>
                            <span className="mt-3 text-[9px] uppercase tracking-[0.2em] text-[#29271F]/60">
                              LARISÉ COLLECTION
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#211c17]/55 via-transparent to-black/5 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

                        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 sm:left-4 sm:top-4">
                          {theme.is_premium && (
                            <span className="bg-[#29271F]/85 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                              Premium
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white sm:bottom-5 sm:left-5 sm:right-5">
                          <span className="text-[9px] uppercase tracking-[0.18em] text-white/80 sm:text-[10px]">
                            {categoryLabels[category] ?? theme.category}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="pt-3 sm:pt-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate font-serif text-lg sm:text-xl lg:text-2xl">
                            {theme.name}
                          </h3>
                          {theme.description && (
                            <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#29271F]/60 sm:text-xs sm:leading-6">
                              {theme.description}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 pt-1 text-[10px] text-[#927653] sm:text-xs">
                          {formatPrice(theme.price)}
                        </span>
                      </div>

                      {features.length > 0 && (
                        <div className="mt-3 hidden flex-wrap gap-x-3 gap-y-1.5 sm:flex">
                          {features.slice(0, 2).map((feature) => (
                            <span
                              key={feature}
                              className="text-[10px] text-[#29271F]/55"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="border-y border-[#29271F]/15 py-16 text-center sm:py-24">
            <Palette className="mx-auto mb-4 text-[#A58A67]" size={28} />
            <h3 className="font-serif text-2xl">Koleksi sedang disiapkan</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#29271F]/60">
              Tema undangan akan tampil di sini setelah tersedia. Silakan
              kembali lagi sebentar.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
