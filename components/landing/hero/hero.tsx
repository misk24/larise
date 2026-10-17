"use client";

import { Item, Stagger } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-background pt-24 sm:pt-28 lg:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-20 -z-10 size-72 rounded-full bg-accent/15 blur-3xl sm:size-96" />
      <div className="mx-auto grid min-h-[calc(100svh-6rem)] max-w-7xl items-center gap-12 px-5 pb-16 pt-8 sm:px-8 sm:pb-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:px-10 lg:py-16">
        <Stagger className="relative z-10 max-w-2xl">
          <Item>
            <p className="mb-6 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground sm:text-xs">
              <span className="h-px w-8 bg-accent" />
              Undangan digital, lebih personal
            </p>
          </Item>
          <Item>
            <h1 id="hero-title" className="frontend-display max-w-xl text-[clamp(3.25rem,9vw,6.75rem)] leading-[0.94] tracking-[-0.065em] text-balance">
              Your Story,
              <br />
              <span className="font-normal italic text-accent">Beautifully</span>
              <br />
              Told.
            </h1>
          </Item>
          <Item>
            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:mt-8 sm:text-lg sm:leading-8">
              Undangan pernikahan digital yang personal, elegan, dan mudah dibagikan. Dibuat untuk cerita yang hanya milik kalian.
            </p>
          </Item>
          <Item>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
              <Button size="lg" className="group h-12 rounded-full px-6" asChild>
                <Link href="/register">Buat Undangan</Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 rounded-full border-border bg-transparent px-6" asChild>
                <SmoothScrollLink href="#collections">Lihat Pilihan Tema</SmoothScrollLink>
              </Button>
            </div>
          </Item>
        </Stagger>

        <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
          <div className="relative aspect-[4/4.7] overflow-hidden rounded-t-[48%] rounded-b-[1.25rem] bg-secondary sm:rounded-b-[1.5rem]">
            <Image src="/images/hero.jpg" alt="Inspirasi suasana pernikahan yang hangat dan intim" fill priority sizes="(max-width: 1024px) 90vw, 44vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#29271f]/40 via-transparent to-[#29271f]/5" />
            <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/30 bg-[#faf9f6]/90 p-4 backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.24em] text-[#8a765d] sm:text-[10px]">LARISÉ</p>
                  <p className="frontend-display mt-1 text-2xl italic leading-tight text-[#29271f] sm:text-3xl">A day to remember</p>
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}