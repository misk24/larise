export interface TestimonialSectionProps {
  title: string;
  sub: string;
  testimonials: Array<{
    name: string;
    location: string;
    image: string;
    content: string;
    rating: number;
  }>;
}
