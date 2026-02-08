import { AboutSection } from "@/components/landing/about";
import { ThemeSectionHorizontal } from "@/components/landing/collection";
import { CTASection } from "@/components/landing/cta";
import { FAQSection } from "@/components/landing/faq";
import { FeatureSection } from "@/components/landing/feature";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { TestimonialsSection } from "@/components/landing/testimonial";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <ThemeSectionHorizontal />
      <CTASection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
