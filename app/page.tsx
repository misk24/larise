"use client";

import AboutSection from "@/components/section/about";
import CtaSection from "@/components/section/cta";
import FeatureSection from "@/components/section/feature";
import HeroSection from "@/components/section/hero";
import TemplateSection from "@/components/section/template";

export default function Home() {
  return (
    <main className="bg-background text-foreground dark:bg-foreground">
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <TemplateSection />
      <CtaSection />
    </main>
  );
}
