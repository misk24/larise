import { Container } from "@/components/landing/ui/container";

const steps = [
  { title: "Pilih tema", description: "Mulai dari desain yang paling dekat dengan suasana dan cerita kalian." },
  { title: "Isi ceritanya", description: "Tambahkan informasi pasangan, detail acara, foto, dan konten yang tersedia." },
  { title: "Bagikan kabar", description: "Periksa undangan, publikasikan saat siap, lalu bagikan tautannya kepada tamu." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="bg-ink py-24 text-ivory sm:py-32 lg:py-40">
      <Container>
        <div className="max-w-2xl">
          <h2 id="how-it-works-title" className="frontend-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] tracking-[-0.05em] text-balance">
            Dari ide kecil menjadi kabar bahagia.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Tidak perlu mulai dari halaman kosong. Susun undangan secara bertahap, sesuai detail yang ingin kalian bagikan.
          </p>
        </div>
        {/* A real sequence: vertical line on mobile, horizontal line from md up. */}
        <ol className="mt-14 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="relative border-l border-white/25 pl-8 md:border-l-0 md:border-t md:pl-0 md:pt-8">
              <span aria-hidden="true" className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-gold-soft md:-top-[5px] md:left-0" />
              <span className="frontend-display block text-6xl leading-none text-gold-soft md:text-7xl">{index + 1}</span>
              <h3 className="frontend-display mt-5 text-2xl tracking-tight sm:text-3xl">{step.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-white/70 sm:text-base sm:leading-7">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
