"use client";

import { Item, Stagger } from "@/components/motion";
import { Button } from "@/components/ui/button";
import heroImage from "@/public/images/romantic-wedding-flowers-soft-pink-petals-elegant-.jpg";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { heroSection } from "./constant";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
      </motion.div>

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <Stagger className="max-w-3xl mx-auto text-center">
          <Item>
            <h1 id="hero-title" className="mb-8 text-balance">
              {heroSection.title}
            </h1>
          </Item>

          <Item>
            <p className="text-muted-foreground tracking-[0.3em] uppercase mb-12">
              {heroSection.sub}
            </p>
          </Item>

          <Item>
            <div className="max-w-sm mx-auto px-6 grid grid-cols-2 items-center justify-center gap-6">
              <Button size="lg" className="rounded-full" asChild>
                <Link href={heroSection.cta.primary.href}>
                  <span>{heroSection.cta.primary.label}</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-background hover:border-accent hover:text-primary-foreground rounded-full"
                asChild
              >
                <Link href={heroSection.cta.secondary.href}>
                  <span>{heroSection.cta.secondary.label}</span>
                </Link>
              </Button>
            </div>
          </Item>
        </Stagger>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
