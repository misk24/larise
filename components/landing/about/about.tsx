"use client";

import { FadeLeft, FadeRight, FadeUp } from "@/components/motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { aboutSection } from "./constant";
import { StatCounter } from "./stat-counter";

export function AboutSection() {
  const isMobile = useIsMobile();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="px-6 py-24 md:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-12">
          <FadeLeft>
            <h2 id="about-title" className="max-w-xl mx-auto text-balance">
              {aboutSection.title}
            </h2>
          </FadeLeft>

          {isMobile ? (
            <FadeUp>
              <p className="text-muted-foreground leading-relaxed">
                {aboutSection.description}
              </p>
            </FadeUp>
          ) : (
            <FadeRight>
              <p className="text-muted-foreground leading-relaxed">
                {aboutSection.description}
              </p>
            </FadeRight>
          )}
        </div>

        <div className="mt-12 md:mt-24">
          <h2 id="stats-title" className="sr-only">
            Statistik
          </h2>

          <FadeUp className="grid grid-cols-3 gap-12">
            {aboutSection.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <StatCounter value={stat.value} decimals={stat.decimal} />
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
