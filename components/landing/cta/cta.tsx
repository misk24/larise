import { Button } from "@/components/ui/button";
import { useGsapReveal } from "@/hooks/use-gsap";
import { CTA_SECTION } from "./constant";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function CtaSection() {
  const ctaRef = useRef<HTMLDivElement>(null)
  useGsapReveal(ctaRef);

  return (
    <section className="px-6">
      <div 
        ref={ctaRef}
        className="px-6 py-32 bg-foreground text-background text-center rounded-2xl"
      >
        <h2 className="text-4xl">
          {CTA_SECTION.title}
        </h2>

        <p className="mt-6 text-background/80">
          {CTA_SECTION.description}
        </p>
        <Link href={CTA_SECTION.cta.href}>
          <Button size="lg" variant="secondary" className="mt-10 rounded-full cursor-pointer">
            {CTA_SECTION.cta.label}
          </Button>
        </Link>
      </div>
    </section>
  )
}