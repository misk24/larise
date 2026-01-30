"use client";

import { CheckSquare } from "lucide-react";
import { featureSection } from "./constant";

export function FeatureSection() {
  return (
    <section id="features" className="px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-16">{featureSection.title}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {featureSection.features.map((feature, index) => (
            <div key={index} className="rounded-2xl bg-background p-6">
              <h3>{feature.title}</h3>
              {/* <p className="mt-4 text-muted-foreground">
                {feature.description}
              </p> */}
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {feature.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckSquare className="size-4" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
