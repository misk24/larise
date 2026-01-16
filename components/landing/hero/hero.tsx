import { Button } from "@/components/ui/button";
import { useGsapRevealUp, useGsapSplitText } from "@/hooks/use-gsap";
import HeroBackground from "./animation";
import { HERO_SECTION } from "./constant";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowRight, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

export function HeroSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  useGsapSplitText(titleRef);

  return (
    // <section className="relative h-screen flex items-center justify-center overflow-hidden">
    //   <HeroBackground />

    //   <div className="relative z-10 max-w-3xl text-center">
    //     <div className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
    //       {HERO_SECTION.sub}
    //     </div>

    //     <h1 ref={titleRef} className="mt-6 text-5xl md:text-6xl tracking-[0.3em]">
    //       {HERO_SECTION.title}
    //     </h1>

    //     <p className="mt-8 text-muted-foreground">
    //       {HERO_SECTION.description}
    //     </p>

    //     <div className="mt-12 max-w-xs mx-auto grid grid-cols-2 gap-4">
    //       <Link href={HERO_SECTION.cta.primary.href}>
    //         <Button
    //           size="lg"
    //           className="w-full rounded-full cursor-pointer"
    //         >
    //           {HERO_SECTION.cta.primary.label}
    //         </Button>
    //       </Link>

    //       <Link href={HERO_SECTION.cta.secondary.href}>
    //         <Button
    //           variant="outline"
    //           size="lg"
    //           className="w-full hover:text-background rounded-full cursor-pointer"
    //         >
    //           {HERO_SECTION.cta.secondary.label}
    //         </Button>
    //       </Link>
    //     </div>
    //   </div>
    // </section>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/romantic-wedding-flowers-soft-pink-petals-elegant-.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-muted-foreground text-xs tracking-[0.3em] uppercase mb-6 animate-fade-up">
            {HERO_SECTION.sub}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-8 animate-fade-up text-balance">
            {HERO_SECTION.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-up text-pretty">
            {HERO_SECTION.description}
          </p>

          <div className="max-w-xs mx-auto grid grid-cols-2 items-center justify-center gap-4 animate-fade-up">
            <Button size="lg" asChild className="w-full rounded-full">
              <Link href="/register">
                {HERO_SECTION.cta.primary.label}
                {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
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

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-up">
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
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
