export interface ThemeSectionProps {
  title: string;
  themes: Array<{
    id: number;
    name: string;
    category: string;
    image: string;
    popular: boolean;
  }>;
}
