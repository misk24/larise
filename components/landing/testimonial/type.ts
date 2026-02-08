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
  animate: Array<{
    name: string;
    designation: string;
    quote: string;
    src: string;
  }>;
}
