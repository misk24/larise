import { ThemeSectionHorizontal } from "@/components/landing/collection/collections";
import { CTASection } from "@/components/landing/cta/cta";
import { FAQSection } from "@/components/landing/faq/faq";
import { FeaturesSection } from "@/components/landing/features/features";
import { Footer } from "@/components/landing/footer/footer";
import { HeroSection } from "@/components/landing/hero/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { ValueSection } from "@/components/landing/value/value";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ValueSection />
      <ThemeSectionHorizontal />
      <FeaturesSection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
