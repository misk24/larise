"use client";

import { AboutSection } from "@/components/landing/about";
import { CTASection } from "@/components/landing/cta";
import { FeatureSection } from "@/components/landing/feature";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero";
import { PricingSection } from "@/components/landing/pricing";
import { TemplateSection } from "@/components/landing/template";
import { TestimonialsSection } from "@/components/landing/testimonial";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <TemplateSection />
      <PricingSection />
      <CTASection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
