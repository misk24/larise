"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { themes, themeSection } from "./constant";

export function ThemeSection() {
  return (
    <section id="collections" className="px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-16">{themeSection.title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map((theme) => (
            <div key={theme.id}>
              <Card className="group overflow-hidden p-0 hover:shadow-xl transition-all duration-300">
                <CardHeader className="relative aspect-square overflow-hidden">
                  <Image
                    src="/images/logo-light.png"
                    alt={theme.name}
                    fill
                    sizes="200"
                    loading="eager"
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
