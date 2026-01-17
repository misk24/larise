import { Button } from "@/components/ui/button";
import { HERO_SECTION } from "./constant";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useGsapRevealUp } from "@/hooks/use-gsap";

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  useGsapRevealUp(heroRef)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/romantic-wedding-flowers-soft-pink-petals-elegant-.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
      </div> */}

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div ref={heroRef} className="max-w-3xl mx-auto text-center">
          <div className="text-muted-foreground text-xs tracking-[0.3em] uppercase mb-6 animate-fade-up">
            {HERO_SECTION.sub}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-8 animate-fade-up text-balance change">
            {HERO_SECTION.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-up text-pretty">
            {HERO_SECTION.description}
          </p>

          <div className="max-w-xs mx-auto grid grid-cols-2 items-center justify-center gap-4 animate-fade-up">
            <Button size="lg" asChild className="w-full rounded-full">
              <Link href="/register">
                {HERO_SECTION.cta.primary.label}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full rounded-full"
            >
              <Link href="#template">{HERO_SECTION.cta.secondary.label}</Link>
            </Button>
          </div>

          {/* <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-up">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-serif font-semibold text-primary">
                500+
              </p>
              <p className="text-sm text-muted-foreground">Pasangan Bahagia</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-serif font-semibold text-primary">
                50+
              </p>
              <p className="text-sm text-muted-foreground">Template Premium</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-serif font-semibold text-primary">
                4.9
              </p>
              <p className="text-sm text-muted-foreground">Rating Pengguna</p>
            </div>
          </div> */}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
