interface FeatureProps {
  id: number,
  title: string,
  description: string,
}

export interface FeatureSectionProps {
  title: string,
  feature: FeatureProps[],
}