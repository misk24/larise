import { Clock, Edit, Gift, ImageIcon, MessageSquareHeart, Music, Palette, Send, Users } from "lucide-react";
import { FeatureSectionProps } from "./type";

export const FEATURE_SECTION: FeatureSectionProps = {
  title: "Fitur Utama",
  feature: [
    { 
      icon: Palette, 
      title: "Desain Premium", 
      description: "Pilih dari koleksi template elegan yang dapat dikustomisasi sesuai tema pernikahan Anda.",
    },
    {
      icon: Users,
      title: "Kelola Tamu",
      description: "Kelola daftar tamu undangan dengan mudah dan kirim undangan secara personal.",
    },
    {
      icon: Send,
      title: "RSVP Online",
      description: "Terima konfirmasi kehadiran tamu secara real-time dengan fitur RSVP terintegrasi.",
    },
    {
      icon: ImageIcon,
      title: "Galeri Foto",
      description: "Tampilkan momen-momen indah Anda dalam galeri foto yang cantik.",
    },
    {
      icon: MessageSquareHeart,
      title: "Ucapan & Doa",
      description: "Terima ucapan selamat dan doa restu dari keluarga dan teman-teman.",
    },
    {
      icon: Gift,
      title: "Amplop Digital",
      description: "Fitur amplop digital untuk tamu yang ingin memberikan hadiah.",
    },
    {
      icon: Clock,
      title: "Countdown Timer",
      description: "Hitung mundur menuju hari bahagia dengan countdown timer yang elegan.",
    },
    {
      icon: Music,
      title: "Musik Latar",
      description: "Tambahkan lagu favorit sebagai musik latar undangan Anda.",
    },
  ]
}