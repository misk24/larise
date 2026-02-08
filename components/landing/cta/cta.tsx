"use client";

import { FadeLeft, Item, Stagger } from "@/components/motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ctaSection } from "./constant";

export function CTASection() {
  return (
    <section
      aria-labelledby="cta-title"
      className="px-6 py-20 md:px-8 md:py-24 bg-primary text-primary-foreground"
    >
      <div className="max-w-3xl mx-auto px-2">
        <Stagger className="md:text-center">
          <FadeLeft>
            <h2 id="cta-title" className="mb-6 text-balance">
              {ctaSection.title}
            </h2>
          </FadeLeft>

          <Item>
            <p className="opacity-90 mb-8 max-w-md mx-auto">
              {ctaSection.description}
            </p>
          </Item>

          <Item>
            <Button
              variant="outline"
              size="lg"
              className="border-background hover:border-accent text-primary hover:text-primary-foreground rounded-full"
              asChild
            >
              <Link href={ctaSection.cta.href}>
                <span>{ctaSection.cta.label}</span>
              </Link>
            </Button>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
