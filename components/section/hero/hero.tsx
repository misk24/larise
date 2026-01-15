import { useGsapContext, useGsapRevealUp } from "@/hooks/use-gsap";
import { Button } from "../../ui/button"
import gsap from "gsap"
import Link from "next/link";
import { useRef } from "react"
import { LOGO } from "../../layout/header/constant";
import HeroBackground from "./animation";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  useGsapRevealUp(heroRef);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <HeroBackground />
      <div ref={heroRef} className="relative z-10 max-w-3xl text-center">
        <p data-hero-eyebrow className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Digital Wedding Invitation
        </p>
        <h1 data-hero-title className="mt-6 text-5xl md:text-6xl tracking-[0.3em]">
          {LOGO}
        </h1>
        <p data-hero-desc className="mt-8 text-muted-foreground">
          Undangan pernikahan digital dengan pendekatan editorial dan sentuhan modern luxe.
        </p>
        <div data-hero-cta className="mt-12 max-w-xs mx-auto grid grid-cols-2 gap-4">
          <Link href="#">
            <Button size="lg" className="w-full rounded-full cursor-pointer">Order Now</Button>
          </Link>
          <Link href="#template">
            <Button variant="outline" size="lg" className="w-full hover:text-background rounded-full cursor-pointer">View Collection</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}