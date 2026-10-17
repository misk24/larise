"use client";

import { FadeLeft, FadeUp } from "@/components/motion";

const values = [
  { title: "Personal dari awal", description: "Nama, cerita, dan detail hari istimewa disusun dalam satu undangan yang terasa dekat dengan kalian." },
  { title: "Mudah dibagikan", description: "Satu tautan untuk dibagikan ke keluarga dan teman, tanpa perlu repot mengirim file satu per satu." },
  { title: "Sesuai gaya kalian", description: "Pilih tema dan atur konten yang tersedia agar undangan terasa selaras dengan perayaan kalian." },
];

export function ValueSection() {
  return (
    <section id="value" aria-labelledby="value-title" className="relative overflow-hidden bg-[#f0ede5] px-5 py-20 text-[#29271f] sm:px-8 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <FadeLeft>
          <div className="grid gap-8 border-b border-[#29271f]/15 pb-10 md:grid-cols-[0.85fr_1.15fr] md:items-end md:gap-12 md:pb-14">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#8b765a] sm:text-xs"><span className="h-px w-8 bg-[#a58a67]" />Tentang LARISÉ</p>
              <h2 id="value-title" className="frontend-display max-w-md text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.05em] text-balance">Bukan sekadar <span className="italic">undangan.</span></h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[#625d51] sm:text-lg sm:leading-8 md:justify-self-end">Sebuah ruang kecil untuk membagikan kabar bahagia, memperkenalkan cerita kalian, dan membantu orang-orang terdekat hadir di momen yang berarti.</p>
          </div>
        </FadeLeft>
        <div className="grid gap-0 pt-2 md:grid-cols-3 md:pt-8">
          {values.map((value, index) => (
            <FadeUp key={value.title}>
              <article className={["flex h-full flex-col border-b border-[#29271f]/15 py-7 sm:py-8 md:border-b-0 md:py-5", index !== 0 ? "md:border-l md:pl-7 lg:pl-10" : "md:pr-7 lg:pr-10", index === 1 ? "lg:px-10" : ""].join(" ")}>
                <h3 className="frontend-display text-2xl tracking-tight sm:text-3xl">{value.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[#625d51] sm:text-base sm:leading-7">{value.description}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}