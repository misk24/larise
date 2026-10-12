"use client";

import { Item, Stagger } from "@/components/motion";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { heroSection } from "./constant";

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[min(900px,100svh)] items-center justify-center overflow-hidden bg-background px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 1.035 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="absolute inset-0 -z-20"
        aria-hidden="true"
      >
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/80 via-background/55 to-background/80"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-x-5 inset-y-8 -z-10 border border-foreground/10 md:inset-x-8 md:inset-y-10" aria-hidden="true" />

      <div className="mx-auto w-full max-w-6xl py-16 md:py-24">
        <Stagger className="mx-auto max-w-5xl text-center">
          <Item>
            <h1
              id="hero-title"
              className="mx-auto max-w-5xl text-balance font-heading text-[clamp(3.1rem,9vw,8.5rem)] font-normal leading-[0.94] tracking-[-0.065em] text-foreground"
            >
              {heroSection.title}
            </h1>
          </Item>

          <Item>
            <p className="mx-auto mt-7 max-w-lg text-pretty text-base leading-relaxed text-foreground/80 md:mt-9 md:text-lg">
              {heroSection.sub}
            </p>
          </Item>
        </Stagger>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/70 to-transparent md:h-28"
        aria-hidden="true"
      />
    </section>
  );
}
