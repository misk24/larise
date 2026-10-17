"use client";

import { FadeUp } from "@/components/motion";

const values = [
  {
    number: "01",
    title: "Personal dari awal",
    description:
      "Nama, cerita, dan detail hari istimewa disusun dalam satu undangan yang terasa dekat dengan kalian.",
  },
  {
    number: "02",
    title: "Mudah dibagikan",
    description:
      "Satu tautan untuk dibagikan ke keluarga dan teman, tanpa perlu repot mengirim file satu per satu.",
  },
  {
    number: "03",
    title: "Sesuai gaya kalian",
    description:
      "Pilih tema dan atur konten yang tersedia agar undangan terasa selaras dengan perayaan kalian.",
  },
];

export function ValueSection() {
  return (
    <section
      id="value"
      aria-labelledby="value-title"
      className="relative overflow-hidden bg-[#29271f] px-5 py-20 text-[#faf9f6] sm:px-8 sm:py-28 lg:py-32"
    >
      <div className="relative mx-auto max-w-7xl">
        <FadeUp>
          <div className="grid gap-7 border-b border-white/15 pb-10 md:grid-cols-[1fr_0.75fr] md:items-end md:gap-12 md:pb-14">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#c8b18f] sm:text-xs">
                <span className="h-px w-8 bg-[#a58a67]" />
                Kenapa LARISÉ
              </p>
              <h2
                id="value-title"
                className="frontend-display max-w-2xl text-[clamp(2.75rem,6vw,5rem)] leading-[0.98] tracking-[-0.055em] text-balance"
              >
                Lebih dekat dengan <span className="italic text-[#c8b18f]">cerita kalian.</span>
              </h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-white/65 sm:text-lg sm:leading-8 md:justify-self-end">
              Undangan yang mudah disiapkan, nyaman dibagikan, dan tetap terasa
              personal untuk momen yang berarti.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-0 pt-4 md:grid-cols-3 md:pt-8">
          {values.map((value, index) => (
            <FadeUp key={value.number}>
              <article
                className={[
                  "flex h-full flex-col border-b border-white/15 py-7 sm:py-9 md:border-b-0 md:py-5",
                  index > 0
                    ? "md:border-l md:pl-7 lg:pl-10"
                    : "md:pr-7 lg:pr-10",
                  index === 1 ? "lg:px-10" : "",
                ].join(" ")}
              >
                <span className="text-xs tracking-[0.16em] text-[#c8b18f]">
                  {value.number}
                </span>
                <h3 className="frontend-display mt-5 text-2xl font-normal tracking-tight sm:text-3xl">
                  {value.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
                  {value.description}
                </p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
