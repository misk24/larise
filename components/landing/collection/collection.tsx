"use client";

import { FadeLeft, FadeUp } from "@/components/motion";
import Image from "next/image";
import { themeSection } from "./constant";

export function ThemeSection() {
  return (
    <section
      id="collections"
      aria-labelledby="collections-title"
      className="bg-[#F8F6F1] px-5 py-20 text-[#29271F] sm:px-8 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <FadeLeft>
          <div className="mb-10 border-b border-[#29271F]/15 pb-8 sm:mb-14 sm:pb-10">
            <p className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#927653] sm:text-xs">
              <span className="h-px w-8 bg-[#A58A67]" />
              The collection
            </p>
            <h2 id="collections-title" className="frontend-display max-w-3xl text-[clamp(2.75rem,6vw,5rem)] leading-[0.98] tracking-[-0.055em]">
              {themeSection.title}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#625D51] sm:text-base sm:leading-8">
              {themeSection.description}
            </p>
          </div>
        </FadeLeft>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-7">
          {themeSection.themes.map((theme, index) => (
            <FadeUp key={theme.id}>
              <article className="group h-full">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE5DA]">
                  <Image
                    src={theme.image || "/images/logo-light.png"}
                    alt={`Pratinjau tema ${theme.name}`}
                    fill
                    sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 23vw"
                    priority={index === 0}
                    decoding="async"
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {theme.popular && (
                    <span className="absolute right-3 top-3 border border-[#29271F]/15 bg-[#F8F6F1] px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-[#29271F]">
                      Populer
                    </span>
                  )}
                </div>
                <div className="border-b border-[#29271F]/15 py-4">
                  <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#927653]">{theme.category}</p>
                  <h3 className="frontend-display text-xl tracking-tight sm:text-2xl">{theme.name}</h3>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
