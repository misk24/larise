import { LucideIcon } from "lucide-react"

interface FeatureProps {
  icon: LucideIcon,
  title: string,
  description: string,
}

export interface FeatureSectionProps {
  title: string,
  features: FeatureProps[],
}