"use client";

import { Item, Stagger } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { ArrowDownRight, ArrowUpRight, Heart, Sparkles } from "lucide-react";
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
              Digital wedding invitations, made personal
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
                <Link href="/register">Buat Undangan <ArrowUpRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 rounded-full border-border bg-transparent px-6" asChild>
                <SmoothScrollLink href="#collections">Lihat Pilihan Tema <ArrowDownRight className="ml-2 size-4" /></SmoothScrollLink>
              </Button>
            </div>
          </Item>
          <Item>
            <div className="mt-10 flex items-center gap-3 border-t border-border/80 pt-5 sm:mt-12">
              <div className="flex -space-x-2" aria-hidden="true">
                <span className="grid size-8 place-items-center rounded-full border-2 border-background bg-[#e8d9c8] text-[#5b4735]"><Heart className="size-3.5" /></span>
                <span className="grid size-8 place-items-center rounded-full border-2 border-background bg-[#d9dfd2] text-[#485543]"><Sparkles className="size-3.5" /></span>
              </div>
              <p className="text-xs leading-5 text-muted-foreground sm:text-sm">Cerita kalian, dirangkai dengan cara yang lebih personal.</p>
            </div>
          </Item>
        </Stagger>

        <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
          <div className="absolute -left-3 top-8 z-10 hidden rounded-full border border-border/70 bg-background/90 px-4 py-3 shadow-sm backdrop-blur sm:flex sm:items-center sm:gap-3 lg:-left-7 lg:top-14">
            <span className="grid size-9 place-items-center rounded-full bg-accent/20 text-foreground"><Sparkles className="size-4" /></span>
            <span className="text-xs leading-5"><strong className="block font-medium">Made for your story</strong><span className="text-muted-foreground">Every detail, thoughtfully yours</span></span>
          </div>
          <div className="relative aspect-[4/4.7] overflow-hidden rounded-t-[48%] rounded-b-[1.25rem] bg-secondary sm:rounded-b-[1.5rem]">
            <Image src="/images/hero.jpg" alt="Inspirasi suasana pernikahan yang hangat dan intim" fill priority sizes="(max-width: 1024px) 90vw, 44vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#29271f]/40 via-transparent to-[#29271f]/5" />
            <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/30 bg-[#faf9f6]/90 p-4 backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.24em] text-[#8a765d] sm:text-[10px]">The beginning of forever</p>
                  <p className="frontend-display mt-1 text-2xl italic leading-tight text-[#29271f] sm:text-3xl">A day to remember</p>
                </div>
                <span className="mb-1 grid size-9 shrink-0 place-items-center rounded-full border border-[#a58a67]/50 text-[#8a765d]"><Heart className="size-4" /></span>
              </div>
            </div>
          </div>
          <p className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
            <span>Intimate by design</span><span>Est. with love · LARISÉ</span>
          </p>
        </div>
      </div>
    </section>
  );
}