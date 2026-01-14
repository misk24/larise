import { useGsapContext } from "@/hooks/use-gsap";
import { Button } from "../../ui/button"
import gsap from "gsap"
import Link from "next/link";
import { useRef } from "react"
import { LOGO } from "../../layout/header/constant";
import HeroBackground from "./animation";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsapContext(containerRef, () => {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from("[data-hero-eyebrow]", { opacity: 0, y: 24, duration: 2 })
      .from("[data-hero-title]", { opacity: 0, y: 24, duration: 2 }, "-=1.8" )
      .from("[data-hero-desc]", { opacity: 0, y: 24, duration: 2 }, "-=1.8" )
      .from("[data-hero-cta]", { opacity: 0, y: 24, duration: 2 }, "-=1.6" )
  });

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      <HeroBackground />
      <div className="relative z-10 max-w-3xl text-center">
        <p data-hero-eyebrow className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Digital Wedding Invitation
        </p>
        <h1 data-hero-title className="mt-6 text-5xl md:text-6xl tracking-[0.3em]">
          {LOGO}
        </h1>
        <p data-hero-desc className="mt-8 text-muted-foreground">
          Undangan pernikahan digital dengan pendekatan editorial dan sentuhan modern luxe.
        </p>
        <div data-hero-cta className="mt-12 flex justify-center gap-4">
          <Link href="#template">
            <Button size="lg" className="rounded-full cursor-pointer">View Collection</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}