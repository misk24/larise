"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ctaSection } from "./constant";

export function CTASection() {
  return (
    <section className="py-20 md:py-24 bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center">
          <h2 className="mb-4 text-balance">{ctaSection.title}</h2>
          <p className="opacity-90 mb-8 max-w-md mx-auto">
            {ctaSection.description}
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="px-6 rounded-full"
            asChild
          >
            <Link href={ctaSection.cta.href}>
              <span>{ctaSection.cta.label}</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
