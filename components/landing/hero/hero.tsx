"use client";

import { Item, Stagger } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const isMobile = useIsMobile();

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
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
      </motion.div>

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <Stagger className="max-w-3xl mx-auto text-center">
          <Item>
            <h1 id="hero-title" className="mb-8 text-display text-balance">
              Timeless Wedding Invitations
            </h1>
          </Item>

          <Item>
            <p className="text-muted-foreground tracking-[0.3em] uppercase mb-12">
              Celebrate Your Forever
            </p>
          </Item>

          <Item>
            <div className="max-w-sm mx-auto px-6 grid grid-cols-2 items-center justify-center gap-6">
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/register">
                  <span className={`${isMobile ? "text-[12px]" : ""}`}>
                    Create Invitation
                  </span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-background hover:border-accent hover:text-primary-foreground rounded-full"
                asChild
              >
                <SmoothScrollLink href="#collections">
                  <span className={`${isMobile ? "text-[12px]" : ""}`}>
                    View Collection
                  </span>
                </SmoothScrollLink>
              </Button>
            </div>
          </Item>
        </Stagger>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
