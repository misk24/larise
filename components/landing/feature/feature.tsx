"use client";

import { FadeLeft, FadeUp } from "@/components/motion";
import { ArrowUpRight } from "lucide-react";
import { featureSection } from "./constant";

export function FeatureSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <FadeLeft>
            <div className="md:sticky md:top-32 md:self-start">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Features
              </p>

              <h2 id="features-title" className="max-w-md text-balance">
                {featureSection.title}
              </h2>

              <p className="mt-6 max-w-md text-muted-foreground">
                {featureSection.description}
              </p>
            </div>
          </FadeLeft>

          <div className="divide-y border-y">
            {featureSection.features.map((feature, index) => (
              <FadeUp key={feature.title}>
                <article className="group py-8 first:pt-8 md:py-10">
                  <div className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-8">
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs tabular-nums text-muted-foreground"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="max-w-xl">
                      <h3 className="text-xl font-medium tracking-tight md:text-2xl">
                        {feature.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                        {feature.description}
                      </p>

                      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                        {feature.items.map((item) => (
                          <li
                            key={item}
                            className="text-sm text-muted-foreground"
                          >
                            <span className="mr-2 text-foreground/50">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <ArrowUpRight
                      aria-hidden="true"
                      className="hidden size-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:block"
                    />
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
