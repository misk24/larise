import { Container } from "@/components/landing/ui/container";

const values = [
  { title: "Personal dari awal", description: "Nama, cerita, dan detail hari istimewa disusun dalam satu undangan yang terasa dekat dengan kalian." },
  { title: "Mudah dibagikan", description: "Satu tautan untuk dibagikan ke keluarga dan teman, tanpa perlu repot mengirim file satu per satu." },
  { title: "Sesuai gaya kalian", description: "Pilih tema dan atur konten yang tersedia agar undangan terasa selaras dengan perayaan kalian." },
];

export function ValueSection() {
  return (
    <section id="value" aria-labelledby="value-title" className="bg-ink py-24 text-ivory sm:py-32 lg:py-40">
      <Container className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-24">
        <div>
          <h2 id="value-title" className="frontend-display max-w-2xl text-[clamp(2.75rem,6vw,5.25rem)] leading-[1] tracking-[-0.055em] text-balance">
            Lebih dekat dengan cerita kalian.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Undangan yang mudah disiapkan, nyaman dibagikan, dan tetap terasa personal untuk momen yang berarti.
          </p>
        </div>
        <dl className="divide-y divide-white/15 border-y border-white/15">
          {values.map((value) => (
            <div key={value.title} className="py-6 sm:py-7">
              <dt className="frontend-display text-2xl tracking-tight sm:text-3xl">{value.title}</dt>
              <dd className="mt-2 max-w-md text-sm leading-6 text-white/70 sm:text-base sm:leading-7">{value.description}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
