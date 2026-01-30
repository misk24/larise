"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Star } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { testimonialSection } from "./constant";

export function TestimonialsSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <section id="testimoni" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-16">{testimonialSection.title}</h2>
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {testimonialSection.testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="md:pl-6 md:basis-1/2 lg:basis-1/3"
              >
                <Card className="bg-card border-border/50">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-accent text-accent"
                          />
                        ),
                      )}
                    </div>
                    <p className="text-foreground mb-6 italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <Image
                        src={testimonial.image || "/images/logo-light.png"}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
