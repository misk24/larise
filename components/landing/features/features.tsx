"use client";

import { FadeLeft, FadeUp } from "@/components/motion";

const features = [
  { title: "Cerita yang personal", description: "Sapa setiap tamu dengan nama, lalu ceritakan perjalanan kalian lewat profil, galeri, dan kisah cinta.", items: ["Nama tamu personal", "Profil dan kisah cinta", "Galeri foto"] },
  { title: "Detail acara", description: "Bantu tamu menemukan informasi acara dan memberi kabar kehadiran tanpa harus bertanya berulang kali.", items: ["Jadwal dan lokasi", "Google Maps", "RSVP dan ucapan"] },
  { title: "Suasana pilihan kalian", description: "Lengkapi pengalaman undangan dengan elemen visual dan audio yang sesuai dengan suasana kalian.", items: ["Musik latar", "Video dan foto", "Kutipan pilihan"] },
  { title: "Mudah dibagikan", description: "Undangan berbasis web yang praktis dibuka dari ponsel dan mudah diteruskan kepada orang terdekat.", items: ["Satu tautan undangan", "Tampilan responsif", "Informasi terpusat"] },
];

export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-title" className="bg-background px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <FadeLeft>
          <div className="grid gap-7 border-b border-border pb-10 md:grid-cols-[1fr_0.8fr] md:items-end md:gap-12 md:pb-14">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:text-xs"><span className="h-px w-8 bg-accent" />Fitur undangan</p>
              <h2 id="features-title" className="frontend-display max-w-2xl text-[clamp(2.75rem,6vw,5rem)] leading-[0.98] tracking-[-0.055em] text-balance">Semua yang perlu, <span className="italic text-accent">tanpa berlebihan.</span></h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 md:justify-self-end">Dari informasi acara sampai sentuhan personal, fitur LARISÉ membantu menyatukan detail penting dalam satu pengalaman.</p>
          </div>
        </FadeLeft>
        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {features.map((feature) => (
            <FadeUp key={feature.title}>
              <article className="flex h-full min-h-[17rem] flex-col bg-background p-6 transition-colors duration-300 hover:bg-[#f4f0e8] sm:min-h-[19rem] sm:p-8 lg:p-10">
                <h3 className="frontend-display text-2xl tracking-tight sm:text-3xl">{feature.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">{feature.description}</p>
                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-border/80 pt-4">
                  {feature.items.map((item) => <li key={item} className="text-xs text-muted-foreground before:mr-2 before:text-accent before:content-['·'] sm:text-sm">{item}</li>)}
                </ul>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}