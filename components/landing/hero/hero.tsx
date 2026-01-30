"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { heroSection } from "./constant";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/romantic-wedding-flowers-soft-pink-petals-elegant-.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
      </div>
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="mb-8 text-balance">{heroSection.title}</h1>
          <p className="text-muted-foreground tracking-[0.3em] uppercase mb-12">
            {heroSection.sub}
          </p>
          <div className="max-w-xs mx-auto grid grid-cols-2 items-center justify-center gap-4">
            <Button size="lg" className="rounded-full" asChild>
              <Link href={heroSection.cta.primary.href}>
                <span>{heroSection.cta.primary.label}</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-background hover:border-accent hover:text-primary-foreground rounded-full"
              asChild
            >
              <Link href={heroSection.cta.secondary.href}>
                <span>{heroSection.cta.secondary.label}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
