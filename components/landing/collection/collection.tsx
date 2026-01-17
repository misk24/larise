import { useGsapParallax, useGsapRevealUp } from "@/hooks/use-gsap";
import { THEME_SECTION, THEMES } from "./constant";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

gsap.registerPlugin(ScrollTrigger);

export function ThemeSection() {
  const themeRef = useRef<HTMLDivElement>(null);
  useGsapRevealUp(themeRef);
  useGsapParallax(themeRef, "[data-theme-item]");

  return (
    <section id="collections" className="px-6 py-32">
      <div ref={themeRef} className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-center mb-16">{THEME_SECTION.title}</h2>

        {/* <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4 text-balance">
            {THEME_SECTION.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            Pilih theme yang sesuai dengan tema dan gaya pernikahan Anda
          </p>
        </div> */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {THEMES.map((theme) => (
            <Card
              key={theme.id}
              className="group overflow-hidden bg-card border-border/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-2/3 overflow-hidden">
                {/* <Image
                  src={theme.image || "/placeholder.svg"}
                  alt={theme.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                /> */}
                {theme.popular && (
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                    Populer
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {theme.category}
                </p>
                <h3 className="text-lg font-semibold text-foreground">
                  {theme.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/register">
              Lihat Semua Thema
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div> */}
      </div>
    </section>
  );
}
