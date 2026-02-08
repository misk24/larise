export interface FAQSectionProps {
  title: string;
  description: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  aside: {
    title: string;
    description: string;
    cta: {
      label: string;
      href: string;
    };
  };
}
