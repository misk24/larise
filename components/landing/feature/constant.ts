import { BookUser, Medal, Palette, Share } from "lucide-react"
import { FeatureSectionProps } from "./type"

export const featureSection: FeatureSectionProps = {
  title: "Everything You Need",
  features: [
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
  ]
}
