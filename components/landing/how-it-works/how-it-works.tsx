"use client";

import { FadeUp } from "@/components/motion";
import { ArrowUpRight } from "lucide-react";

const steps = [
  { number: "01", title: "Pilih tema", description: "Mulai dari desain yang paling dekat dengan suasana dan cerita kalian.", note: "Find your style" },
  { number: "02", title: "Isi ceritanya", description: "Tambahkan informasi pasangan, detail acara, foto, dan konten yang tersedia.", note: "Make it personal" },
  { number: "03", title: "Bagikan kabar", description: "Periksa undangan, publikasikan saat siap, lalu bagikan tautannya kepada tamu.", note: "Ready to share" },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="relative overflow-hidden bg-[#29271f] px-5 py-20 text-[#faf9f6] sm:px-8 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-white/10 sm:size-[28rem]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full border border-[#a58a67]/30 sm:size-96" />
      <div className="relative mx-auto max-w-7xl">
        <FadeUp>
          <div className="grid gap-7 border-b border-white/15 pb-10 md:grid-cols-[1fr_0.75fr] md:items-end md:gap-12 md:pb-14">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#c8b18f] sm:text-xs"><span className="h-px w-8 bg-[#a58a67]" />A simple process</p>
              <h2 id="how-it-works-title" className="frontend-display max-w-2xl text-[clamp(2.75rem,6vw,5rem)] leading-[0.98] tracking-[-0.055em] text-balance">Dari ide kecil menjadi <span className="italic text-[#c8b18f]">kabar bahagia.</span></h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-white/65 sm:text-lg sm:leading-8 md:justify-self-end">Tidak perlu mulai dari halaman kosong. Susun undangan secara bertahap, sesuai detail yang ingin kalian bagikan.</p>
          </div>
        </FadeUp>
        <div className="grid gap-0 pt-4 md:grid-cols-3 md:pt-8">
          {steps.map((step, index) => (
            <FadeUp key={step.number}>
              <article className={["group relative flex h-full flex-col border-b border-white/15 py-7 sm:py-9 md:border-b-0 md:py-5", index > 0 ? "md:border-l md:pl-7 lg:pl-10" : "md:pr-7 lg:pr-10", index === 1 ? "lg:px-10" : ""].join(" ")}>
                <div className="flex items-center justify-between"><span className="frontend-display text-5xl font-light tracking-[-0.06em] text-[#c8b18f] sm:text-6xl">{step.number}</span><ArrowUpRight className="size-5 text-[#c8b18f] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.4} /></div>
                <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-white/45 sm:text-xs">{step.note}</p>
                <h3 className="frontend-display mt-2 text-2xl font-normal tracking-tight sm:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/65 sm:text-base sm:leading-7">{step.description}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}