"use client";

import { FadeUp } from "@/components/motion";
import { howItWorksSection } from "./constant";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <div className="max-w-2xl mb-16 md:mb-20">
            <p className="mb-4 text-xs tracking-[0.25em] uppercase text-muted-foreground">
              {howItWorksSection.eyebrow}
            </p>

            <h2 id="how-it-works-title" className="text-balance">
              {howItWorksSection.title}
            </h2>

            <p className="mt-6 max-w-xl text-muted-foreground">
              {howItWorksSection.description}
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-0 md:grid-cols-3 md:gap-8">
          {howItWorksSection.steps.map((step, index) => (
            <FadeUp key={step.number}>
              <article
                className={[
                  "relative py-8 md:py-0",
                  index !== 0
                    ? "border-t border-border md:border-t-0 md:border-l md:pl-8"
                    : "",
                ].join(" ")}
              >
                <span className="text-sm tracking-[0.2em] text-muted-foreground">
                  {step.number}
                </span>

                <h3 className="mt-6 text-xl">{step.title}</h3>

                <p className="mt-4 max-w-sm text-muted-foreground">
                  {step.description}
                </p>

                {/* Desktop connector */}
                {index < howItWorksSection.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2 right-0 hidden h-px w-8 translate-x-full bg-border md:block"
                  />
                )}
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
