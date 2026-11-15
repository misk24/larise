import { FadeUp } from "@/components/motion";
import { Container } from "@/components/landing/ui/container";
import { NumberedColumns, type NumberedItem } from "@/components/landing/ui/numbered-columns";
import { SectionHeader } from "@/components/landing/ui/section-header";

const values: NumberedItem[] = [
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
    <section id="value" aria-labelledby="value-title" className="bg-ink py-20 text-ivory sm:py-28 lg:py-32">
      <Container>
        <FadeUp>
          <SectionHeader
            tone="dark"
            id="value-title"
            eyebrow="Kenapa LARISÉ"
            title="Lebih dekat dengan"
            accent="cerita kalian."
            description="Undangan yang mudah disiapkan, nyaman dibagikan, dan tetap terasa personal untuk momen yang berarti."
          />
        </FadeUp>
        <NumberedColumns items={values} />
      </Container>
    </section>
  );
}
