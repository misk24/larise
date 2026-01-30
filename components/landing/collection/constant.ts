import { ThemeSectionProps } from "./type";

export const themeSection: ThemeSectionProps = {
  title: "Our Collections",
  themes: [
    {
      id: 1,
      name: "Elegant Rose",
      category: "Elegant",
      image: "/images/elegant-rose-gold-wedding-invitation-template-roma.png",
      popular: true,
    },
    {
      id: 2,
      name: "Modern Minimalist",
      category: "Modern",
      image: "/images/modern-minimalist-wedding-invitation-clean-white-d.png",
      popular: false,
    },
    {
      id: 3,
      name: "Rustic Garden",
      category: "Rustic",
      image: "/images/rustic-garden-wedding-invitation-greenery-botanica.png",
      popular: true,
    },
    {
      id: 4,
      name: "Royal Gold",
      category: "Luxury",
      image: "/images/royal-gold-luxury-wedding-invitation-ornate-elegan.jpg",
      popular: false,
    },
  ],
};
