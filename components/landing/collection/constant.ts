import { ThemeProps, ThemeSectionProps } from "./type";

export const THEME_SECTION: ThemeSectionProps = {
  title: "Our Collections",
}

export const THEMES: ThemeProps[] = [
  {
    id: 1,
    name: "Elegant Rose",
    category: "Elegant",
    image: "/elegant-rose-gold-wedding-invitation-template-roma.jpg",
    popular: true,
  },
  {
    id: 2,
    name: "Modern Minimalist",
    category: "Modern",
    image: "/modern-minimalist-wedding-invitation-clean-white-d.jpg",
    popular: false,
  },
  {
    id: 3,
    name: "Rustic Garden",
    category: "Rustic",
    image: "/rustic-garden-wedding-invitation-greenery-botanica.jpg",
    popular: true,
  },
  {
    id: 4,
    name: "Royal Gold",
    category: "Luxury",
    image: "/royal-gold-luxury-wedding-invitation-ornate-elegan.jpg",
    popular: false,
  },
]