"use client";

import { FadeLeft, FadeUp } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { themeSection } from "./constant";

export function ThemeSection() {
  return (
    <section
      id="collections"
      aria-labelledby="collections-title"
      className="px-6 py-24 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <FadeLeft>
          <h2 id="collections-title" className="mb-16 md:text-center">
            {themeSection.title}
          </h2>
        </FadeLeft>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {themeSection.themes.map((theme, index) => (
            <FadeUp key={theme.id}>
              <Card className="group overflow-hidden p-0 hover:shadow-xl transition-all duration-300">
                <CardHeader className="relative aspect-square overflow-hidden">
                  <Image
                    src={theme.image || "/images/logo-light.png"}
                    alt={`${theme.name} preview`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 220px"
                    priority={index === 0}
                    decoding="async"
                    className="p-8 object-contain group-hover:scale-105 transition-transform duration-500"
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
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
