import { Button } from "@/components/ui/button";
import { useGsapReveal } from "@/hooks/use-gsap";
import { CTA_SECTION } from "./constant";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const ctaRef = useRef<HTMLDivElement>(null)
  useGsapReveal(ctaRef)

  return (
    <section className="py-20 md:py-32 bg-primary text-primary-foreground">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-balance">
            {CTA_SECTION.title}
          </h2>

          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            {CTA_SECTION.description}
          </p>

          <Button
            size="lg"
            variant="secondary"
            asChild
            className="px-6 rounded-full"
          >
            <Link href={CTA_SECTION.cta.href}>
              {CTA_SECTION.cta.label}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
