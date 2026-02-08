import { FAQSectionProps } from "./type";

export const faqSection: FAQSectionProps = {
  title: "FAQ",
  description:
    "Ringkas, jelas, dan langsung ke poin supaya kamu cepat menentukan langkah berikutnya.",
  faqs: [
    {
      question: "Berapa lama proses pembuatan undangan?",
      answer:
        "Rata-rata 1-3 hari kerja setelah data lengkap diterima. Revisi minor bisa selesai di hari yang sama.",
    },
    {
      question: "Apakah bisa custom tema sesuai keinginan?",
      answer:
        "Bisa. Kamu bisa pilih dari koleksi yang ada lalu kami sesuaikan warna, foto, dan detail konten.",
    },
    {
      question: "Bagaimana cara isi data tamu dan RSVP?",
      answer:
        "Kami sediakan template data tamu. RSVP bisa aktif otomatis dan kamu dapat pantau dari dashboard.",
    },
    {
      question: "Apakah undangan bisa diakses di semua perangkat?",
      answer: "Ya, desain responsif dan optimal untuk mobile maupun desktop.",
    },
    {
      question: "Apakah ada batas revisi?",
      answer:
        "Tidak ada batas untuk revisi minor. Untuk perubahan besar, kami konfirmasi estimasi waktu tambahan.",
    },
  ],
  aside: {
    title: "Masih ada pertanyaan?",
    description:
      "Tim kami siap bantu pilih tema, isi konten, sampai undangan live.",
    cta: {
      label: "Konsultasi via WhatsApp",
      href: "https://wa.me/6281234567890",
    },
  },
};
