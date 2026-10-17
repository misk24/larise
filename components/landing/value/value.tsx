"use client";

import { FadeLeft, FadeUp } from "@/components/motion";
import { ArrowUpRight, Heart, Link2, Palette } from "lucide-react";

const values = [
  { number: "01", title: "Personal dari awal", description: "Nama, cerita, dan detail hari istimewa disusun dalam satu undangan yang terasa dekat dengan kalian.", icon: Heart },
  { number: "02", title: "Mudah dibagikan", description: "Satu tautan untuk dibagikan ke keluarga dan teman, tanpa perlu repot mengirim file satu per satu.", icon: Link2 },
  { number: "03", title: "Sesuai gaya kalian", description: "Pilih tema dan atur konten yang tersedia agar undangan terasa selaras dengan perayaan kalian.", icon: Palette },
];

export function ValueSection() {
  return (
    <section id="value" aria-labelledby="value-title" className="relative overflow-hidden bg-[#f0ede5] px-5 py-20 text-[#29271f] sm:px-8 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <FadeLeft>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#8b765a] sm:text-xs"><span className="h-px w-8 bg-[#a58a67]" />Tentang LARISÉ</p>
            <h2 id="value-title" className="frontend-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.05em] text-balance">Bukan sekadar <span className="italic">undangan.</span></h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#625d51] sm:text-lg sm:leading-8">Sebuah ruang kecil untuk membagikan kabar bahagia, memperkenalkan cerita kalian, dan membantu orang-orang terdekat hadir di momen yang berarti.</p>
          </div>
        </FadeLeft>
        <div className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-3 md:gap-5">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <FadeUp key={value.number}>
                <article className="group h-full border-t border-[#29271f]/25 px-1 py-6 sm:px-3 sm:py-7">
                  <div className="flex items-center justify-between">
                    <span className="text-xs tracking-[0.18em] text-[#8b765a]">{value.number}</span>
                    <Icon className="size-5 text-[#a58a67] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-8deg]" strokeWidth={1.4} />
                  </div>
                  <h3 className="frontend-display mt-7 text-2xl tracking-tight sm:text-3xl">{value.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-[#625d51] sm:text-base sm:leading-7">{value.description}</p>
                  <ArrowUpRight className="mt-7 size-4 text-[#a58a67] opacity-70" strokeWidth={1.5} />
                </article>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
