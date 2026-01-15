"use client";

import AboutSection from "@/components/landing/about";
import CtaSection from "@/components/landing/cta";
import FeatureSection from "@/components/landing/feature";
import HeroSection from "@/components/landing/hero";
import TemplateSection from "@/components/landing/template";

export default function Home() {
  return (
    <main className="bg-background text-primary dark:bg-foreground">
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <TemplateSection />
      <CtaSection />
    </main>
  );
}
