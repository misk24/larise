import { useGsapRevealUp, useGsapScrollStagger } from "@/hooks/use-gsap";
import { FEATURE_SECTION } from "./constant";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function FeatureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useGsapRevealUp(sectionRef);
  useGsapScrollStagger(sectionRef, "[data-feature-card]");

  return (
    <section id="features" ref={sectionRef} className="px-6 py-32 bg-muted">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl mb-16">{FEATURE_SECTION.title}</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_SECTION.feature.map((feature, index) => (
            <div
              data-feature-card
              key={index}
              className="rounded-2xl bg-background p-6"
            >
              <h3 className="text-xl font-medium">{feature.title}</h3>

              <p className="mt-4 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
