import { FeatureSectionProps } from "./type";

export const featureSection: FeatureSectionProps = {
  title: "Everything You Need",
  features: [
    {
      title: "Invitation Personalization",
      description: "Undangan yang terasa dibuat khusus, bukan template massal.",
      items: [
        "Nama tamu otomatis",
        "Tema & urutan fleksibel",
        "Musik bebas request",
      ],
    },
    {
      title: "Event Information",
      description:
        "Detail acara tersaji rapi agar tamu tidak salah waktu atau lokasi.",
      items: [
        "Detail acara lengkap",
        "Navigasi Google Maps",
        "Hitung mundur otomatis",
      ],
    },
    {
      title: "Guest Interaction",
      description:
        "Kelola kehadiran dan pesan tamu tanpa ribet follow-up manual.",
      items: ["RSVP real-time", "Kolom ucapan & doa", "Manajemen daftar tamu"],
    },
    {
      title: "Media & Gifts",
      description:
        "Bagikan momen spesial dan terima hadiah dengan cara modern.",
      items: ["Galeri foto & video", "Amplop digital"],
    },
  ],
};
