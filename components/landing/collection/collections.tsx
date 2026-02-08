"use client";

import { FadeIn, FadeLeft } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { themeSection } from "./constant";

export function ThemeSectionHorizontal() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const panelsRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const panels = useMemo(() => {
    const items = themeSection.themes.slice(0, 5);
    return items.length ? items : themeSection.themes;
  }, []);

  useEffect(() => {
    if (!pageRef.current || !panelsRef.current) return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const previousOverflow = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";

    const ctx = gsap.context(() => {
      const panelItems = gsap.utils.toArray<HTMLElement>(
        "#panels-container .panel",
      );
      if (!panelsRef.current || panelItems.length <= 1) return;

      const tween = gsap.to(panelItems, {
        xPercent: -100 * (panelItems.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: panelsRef.current,
          pin: true,
          start: "top top",
          scrub: 1,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / (panelItems.length - 1),
            inertia: false,
            duration: { min: 0.1, max: 0.1 },
          },
          end: () =>
            "+=" + (panelsRef.current!.offsetWidth - window.innerWidth),
        },
      });

      tweenRef.current = tween;
    }, pageRef);

    return () => {
      tweenRef.current = null;
      ctx.revert();
      document.body.style.overflowX = previousOverflow;
    };
  }, []);

  return (
    <section id="collections" ref={pageRef}>
      <div
        id="panels-container"
        ref={panelsRef}
        style={{ width: `${panels.length * 100}vw` }}
        className="relative flex flex-nowrap h-screen overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <div className="absolute left-0 top-0 z-10 w-screen px-6 pt-32 md:px-8">
            <FadeLeft>
              <h2 id="collections-title" className="md:text-center">
                {themeSection.title}
              </h2>
            </FadeLeft>
          </div>
        </div>

        {panels.map((theme, index) => (
          <article
            key={theme.id}
            id={`panel-${index + 1}`}
            className="panel relative flex w-screen h-screen items-center"
          >
            <FadeIn className="max-w-3xl mx-auto px-6 pt-32 grid grid-cols-1 gap-8 w-full md:px-8 md:grid-cols-2">
              <Card className="group relative lg:h-96">
                <CardHeader className="relative aspect-square overflow-hidden">
                  <Image
                    src="/images/logo-light.png"
                    alt={theme.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 45vw"
                    className="p-8 object-contain group-hover:scale-105 transition-transform duration-500"
                    priority={index === 0}
                  />

                  {theme.popular && (
                    <Badge className="absolute top-3 right-3">Populer</Badge>
                  )}
                </CardHeader>

                <CardContent className="p-4">
                  <span className="text-small text-muted-foreground uppercase tracking-widest mb-1">
                    {theme.category}
                  </span>
                  <h3>{theme.name}</h3>
                </CardContent>
              </Card>
            </FadeIn>
          </article>
        ))}
      </div>
    </section>
  );
}
