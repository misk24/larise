interface ButtonProps {
  label: string,
  href: string,
}

export interface HeroSectionProps {
  title: string,
  sub: string,
  cta: {
    primary: ButtonProps,
    secondary: ButtonProps,
  },
}
