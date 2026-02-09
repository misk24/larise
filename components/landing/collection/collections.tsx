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

    // Store original overflow styles
    const originalBodyOverflow = {
      x: document.body.style.overflowX,
      y: document.body.style.overflowY
    };

    // Apply overflow only to this section's parent, not globally
    const sectionParent = pageRef.current.parentElement;
    if (sectionParent) {
      sectionParent.style.overflowX = "hidden";
    }

    const ctx = gsap.context(() => {
      const panelItems = gsap.utils.toArray<HTMLElement>(
        "#panels-container .panel",
      );
      if (!panelsRef.current || panelItems.length <= 1) return;

      // Mobile detection for responsive behavior
      const isMobile = window.innerWidth < 768;

      const tween = gsap.to(panelItems, {
        xPercent: -100 * (panelItems.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: panelsRef.current,
          pin: true,
          start: "top top",
          scrub: isMobile ? 0.5 : 1,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / (panelItems.length - 1),
            inertia: false,
            duration: { min: 0.1, max: 0.1 },
          },
          end: () => {
            const containerWidth = panelsRef.current!.offsetWidth;
            const viewportWidth = window.innerWidth;
            return "+=" + Math.max(containerWidth - viewportWidth, viewportWidth);
          },
          // Prevent conflicts with other scroll behaviors
          invalidateOnRefresh: true,
        },
      });

      tweenRef.current = tween;
    }, pageRef);

    return () => {
      tweenRef.current = null;
      ctx.revert();
      // Restore original overflow styles
      if (sectionParent) {
        sectionParent.style.overflowX = originalBodyOverflow.x;
      }
    };
  }, []);

  return (
    <section id="collections" ref={pageRef} className="relative overflow-hidden">
      <div
        id="panels-container"
        ref={panelsRef}
        style={{ width: `${panels.length * 100}vw` }}
        className="relative flex flex-nowrap h-screen"
      >
        <div className="absolute left-0 top-0 z-10 w-screen px-6 pt-32 md:px-8 pointer-events-none">
          <FadeLeft className="pointer-events-auto">
            <h2 id="collections-title" className="md:text-center">
              {themeSection.title}
            </h2>
          </FadeLeft>
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
                    src={theme.image || "/images/logo-light.png"}
                    alt={theme.name}
                    fill
                    sizes="(max-width: 768px) 85vw, 40vw"
                    className="p-4 md:p-8 object-contain group-hover:scale-105 transition-transform duration-500"
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
                  <h3 className="text-lg md:text-xl">{theme.name}</h3>
                </CardContent>
              </Card>
            </FadeIn>
          </article>
        ))}
      </div>
    </section>
  );
}
