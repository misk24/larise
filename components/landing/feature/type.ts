interface FeatureProps {
  title: string;
  description: string;
  items: string[];
}

export interface FeatureSectionProps {
  title: string;
  features: FeatureProps[];
}
