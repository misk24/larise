import { Container } from "@/components/landing/ui/container";
import { EditorialAccordion, type EditorialAccordionItem } from "@/components/landing/ui/accordion";

const faqs: EditorialAccordionItem[] = [
  { question: "Apa itu LARISÉ?", answer: "LARISÉ adalah platform undangan pernikahan digital untuk menyusun informasi acara, membagikan cerita, dan mengirim undangan melalui satu tautan." },
  { question: "Apakah isi undangan bisa disesuaikan?", answer: "Kamu dapat menyesuaikan informasi dan konten yang tersedia, seperti nama pasangan, foto, cerita, detail acara, dan elemen lain sesuai tema yang dipilih." },
  { question: "Apakah undangan bisa dibuka lewat HP?", answer: "Bisa. Halaman undangan dirancang responsif agar nyaman dibuka melalui smartphone maupun layar yang lebih besar." },
  { question: "Bagaimana cara membagikan undangan?", answer: "Setelah undangan siap dan dipublikasikan, bagikan tautannya melalui WhatsApp, media sosial, atau kanal komunikasi pilihanmu." },
  { question: "Apakah tamu bisa melakukan RSVP?", answer: "Jika fitur RSVP tersedia pada tema atau paket yang digunakan, tamu dapat mengonfirmasi kehadiran langsung melalui halaman undangan." },
  { question: "Bisakah tema diganti setelah undangan dibuat?", answer: "Penggantian tema mengikuti struktur dan fitur yang didukung oleh tema tujuan. Sebelum mengganti, tinjau kembali tampilan dan konten agar hasilnya sesuai." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export function FAQSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-background py-24 text-fg sm:py-32 lg:py-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
      <Container className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="faq-title" className="frontend-display max-w-lg text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.055em] text-balance">Ada yang ingin diketahui?</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-ink-soft sm:text-base sm:leading-8">Jawaban singkat untuk membantu kamu memahami cara kerja undangan digital LARISÉ.</p>
          </div>
        </div>
        <EditorialAccordion items={faqs} />
      </Container>
    </section>
  );
}
