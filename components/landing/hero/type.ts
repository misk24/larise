import { ButtonProps } from "@/types/frontend";

export interface HeroSectionProps {
  title: string;
  sub: string;
  cta: {
    primary: ButtonProps;
    secondary: ButtonProps;
  };
}
