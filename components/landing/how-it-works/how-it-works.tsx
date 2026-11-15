import { FadeUp } from "@/components/motion";
import { Container } from "@/components/landing/ui/container";
import { NumberedColumns, type NumberedItem } from "@/components/landing/ui/numbered-columns";
import { SectionHeader } from "@/components/landing/ui/section-header";

const steps: NumberedItem[] = [
  { number: "01", title: "Pilih tema", description: "Mulai dari desain yang paling dekat dengan suasana dan cerita kalian." },
  { number: "02", title: "Isi ceritanya", description: "Tambahkan informasi pasangan, detail acara, foto, dan konten yang tersedia." },
  { number: "03", title: "Bagikan kabar", description: "Periksa undangan, publikasikan saat siap, lalu bagikan tautannya kepada tamu." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="bg-ink py-20 text-ivory sm:py-28 lg:py-32">
      <Container>
        <FadeUp>
          <SectionHeader
            tone="dark"
            id="how-it-works-title"
            eyebrow="Cara kerja"
            title="Dari ide kecil menjadi"
            accent="kabar bahagia."
            description="Tidak perlu mulai dari halaman kosong. Susun undangan secara bertahap, sesuai detail yang ingin kalian bagikan."
          />
        </FadeUp>
        <NumberedColumns items={steps} />
      </Container>
    </section>
  );
}
