export interface FeatureSectionProps {
  title: string;
  features: Array<{
    title: string;
    description: string;
    items: Array<string>;
  }>;
}
