"use client";

import { Item, Stagger } from "@/components/motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ctaSection } from "./constant";

export function CTASection() {
  return (
    <section
      aria-labelledby="cta-title"
      className="px-6 py-24 md:px-8 md:py-32 bg-secondary"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Stagger>
          <Item>
            <h2 id="cta-title" className="text-balance">
              {ctaSection.title}
            </h2>
          </Item>

          <Item>
            <p className="mx-auto mt-6 max-w-xl text-muted-foreground text-balance">
              {ctaSection.description}
            </p>
          </Item>

          <Item>
            <Button size="lg" className="mt-8 rounded-full px-8" asChild>
              <Link href={ctaSection.cta.href}>{ctaSection.cta.label}</Link>
            </Button>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
