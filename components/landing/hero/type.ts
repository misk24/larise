import { ButtonProps } from "@/components/landing/shared";

export interface HeroSectionProps {
  title: string;
  sub: string;
  cta: {
    primary: ButtonProps;
    secondary: ButtonProps;
  };
}
