"use client";

import { FadeLeft, FadeUp } from "@/components/motion";
import { featureSection } from "./constant";

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="px-6 py-24 md:px-8 md:py-32"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 md:mb-20">
          <FadeLeft>
            <div>
              <p className="mb-4 text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {featureSection.eyebrow}
              </p>
              <h2 id="features-title" className="text-balance">
                {/* <h2 id="features-title" className="mb-16 md:text-center"> */}
                {featureSection.title}
              </h2>
            </div>
          </FadeLeft>

          <FadeUp>
            <p className="mt-6 max-w-xl text-body text-muted-foreground">
              {featureSection.description}
            </p>
          </FadeUp>
        </div>

        <div className="border-t border-border">
          {featureSection.features.map((feature, index) => (
            <FadeUp key={feature.title}>
              <article className="group border-b border-border py-8 md:py-10">
                <div className="grid gap-6 md:grid-cols-[80px_1fr_2fr] md:items-start md:gap-8 lg:grid-cols-[80px_1fr_1fr]">
                  <span className="pt-1 text-meta text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="tracking-tight transition-transform duration-500 group-hover:translate-x-2">
                    {feature.title}
                  </h3>

                  <p className="text-small text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
