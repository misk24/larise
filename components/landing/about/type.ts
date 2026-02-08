export interface AboutSectionProps {
  title: string;
  description: string;
  stats: Array<{
    value: number;
    decimal: number;
    label: string;
  }>;
}
