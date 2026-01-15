interface ButtonProps {
  label: string,
  href: string,
}

export interface HeroSectionProps {
  sub: string,
  title: string,
  description: string,
  cta: {
    primary: ButtonProps,
    secondary: ButtonProps,
  },
}