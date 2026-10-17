"use client";

import { Item, Stagger } from "@/components/motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-background px-5 py-20 sm:px-8 sm:py-28 lg:py-36">
      <div className="relative mx-auto max-w-4xl text-center">
        <Stagger>
          <Item><p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:text-xs">Mulai dari sini</p></Item>
          <Item><h2 id="cta-title" className="frontend-display mx-auto max-w-3xl text-[clamp(3rem,8vw,6.5rem)] leading-[0.94] tracking-[-0.06em] text-balance">Cerita kalian layak <span className="italic text-accent">dirayakan.</span></h2></Item>
          <Item><p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:mt-8 sm:text-lg sm:leading-8">Mulai susun undangan yang personal, lalu bagikan kabar bahagia kepada orang-orang terdekat.</p></Item>
          <Item><Button size="lg" className="group mt-8 h-12 rounded-full px-7 sm:mt-10" asChild><Link href="/register">Mulai Buat Undangan</Link></Button></Item>
          <Item><p className="mt-5 text-xs text-muted-foreground">Mulai dengan memilih tema yang paling cocok untuk kalian.</p></Item>
        </Stagger>
      </div>
    </section>
  );
}