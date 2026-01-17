"use client";

import { AboutSection } from "@/components/landing/about";
import { CTASection } from "@/components/landing/cta";
import { FeatureSection } from "@/components/landing/feature";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing";
import { ThemeSection } from "@/components/landing/collection";
import { TestimonialsSection } from "@/components/landing/testimonial";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <ThemeSection />
      <PricingSection />
      <CTASection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
