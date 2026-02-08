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

    // Mobile detection
    const isMobile = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 480; // Very small screens

    // Disable horizontal scroll on very small screens
    if (isSmallScreen) {
      return; // Skip GSAP initialization on very small screens
    }

    const ctx = gsap.context(() => {
      const panelItems = gsap.utils.toArray<HTMLElement>(
        "#panels-container .panel",
      );
      if (!panelsRef.current || panelItems.length <= 1) return;

      // Calculate end position based on device type
      const calculateEnd = () => {
        const containerWidth = panelsRef.current!.offsetWidth;
        const viewportWidth = window.innerWidth;
        const endValue = containerWidth - viewportWidth;
        return "+=" + Math.max(endValue, viewportWidth);
      };

      const tween = gsap.to(panelItems, {
        xPercent: -100 * (panelItems.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: panelsRef.current,
          pin: true,
          start: "top top",
          scrub: isMobile ? 0.5 : 1, // Faster scrub on mobile
          anticipatePin: 1,
          // Disable snap on mobile for better touch performance
          snap: isMobile ? undefined : {
            snapTo: 1 / (panelItems.length - 1),
            inertia: false,
            duration: { min: 0.1, max: 0.1 },
          },
          // Improved touch handling
          onUpdate: (self) => {
            if (isTouchDevice && isMobile) {
              // Prevent default touch behavior during scroll
              const touchEvent = (self as any).event;
              if (touchEvent && touchEvent.preventDefault) {
                touchEvent.preventDefault();
              }
            }
          },
          end: calculateEnd(),
          // Mobile-specific settings
          invalidateOnRefresh: true, // Recalculate on resize
          refreshPriority: 1, // Higher priority for mobile
        },
      });

      tweenRef.current = tween;

      // Handle window resize for responsive behavior
      const handleResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }, pageRef);

    return () => {
      tweenRef.current = null;
      ctx.revert();
      document.body.style.overflowX = previousOverflow;
    };
  }, []);

  return (
    <section id="collections" ref={pageRef} className="relative overflow-hidden">
      <div
        id="panels-container"
        ref={panelsRef}
        style={{ width: `${panels.length * 100}vw` }}
        className="relative flex flex-nowrap h-screen overflow-x-hidden overflow-y-hidden md:h-screen max-[480px]:h-auto max-[480px]:w-screen"
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
            className="panel relative flex w-screen h-screen items-center overflow-hidden"
          >
            <FadeIn className="max-w-3xl mx-auto px-6 pt-32 grid grid-cols-1 gap-8 w-full md:px-8 md:grid-cols-2">
              <Card className="group relative lg:h-96 overflow-hidden">
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
