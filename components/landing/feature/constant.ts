import { BookUser, Clock, Edit, Gift, ImageIcon, Medal, MessageSquareHeart, Music, Palette, Send, Share, Users } from "lucide-react";
import { FeatureSectionProps } from "./type";

export const FEATURE_SECTION: FeatureSectionProps = {
  title: "Everything You Need",
  // title: "Fitur Utama",
  feature: [
    {
      icon: Palette,
      title: "Elegant Design",
      description: "Desain bersih dan modern yang tetap relevan sepanjang waktu.",
    },
    {
      icon: Share,
      title: "Easy Sharing",
      description: "Undangan dapat dibagikan dengan mudah melalui berbagai platform.",
    },
    {
      icon: BookUser,
      title: "RSVP & Guest Book",
      description: "Kelola kehadiran tamu secara praktis dan rapi.",
    },
    {
      icon: Medal,
      title: "Mobile Friendly",
      description: "Optimal di semua perangkat tanpa ribet.",
    },
    // { 
    //   icon: Palette, 
    //   title: "Desain Premium", 
    //   description: "Pilih dari koleksi template elegan yang dapat dikustomisasi sesuai tema pernikahan Anda.",
    // },
    // {
    //   icon: Users,
    //   title: "Kelola Tamu",
    //   description: "Kelola daftar tamu undangan dengan mudah dan kirim undangan secara personal.",
    // },
    // {
    //   icon: Send,
    //   title: "RSVP Online",
    //   description: "Terima konfirmasi kehadiran tamu secara real-time dengan fitur RSVP terintegrasi.",
    // },
    // {
    //   icon: ImageIcon,
    //   title: "Galeri Foto",
    //   description: "Tampilkan momen-momen indah Anda dalam galeri foto yang cantik.",
    // },
    // {
    //   icon: MessageSquareHeart,
    //   title: "Ucapan & Doa",
    //   description: "Terima ucapan selamat dan doa restu dari keluarga dan teman-teman.",
    // },
    // {
    //   icon: Gift,
    //   title: "Amplop Digital",
    //   description: "Fitur amplop digital untuk tamu yang ingin memberikan hadiah.",
    // },
    // {
    //   icon: Clock,
    //   title: "Countdown Timer",
    //   description: "Hitung mundur menuju hari bahagia dengan countdown timer yang elegan.",
    // },
    // {
    //   icon: Music,
    //   title: "Musik Latar",
    //   description: "Tambahkan lagu favorit sebagai musik latar undangan Anda.",
    // },
  ]
}