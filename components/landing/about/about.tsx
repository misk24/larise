"use client";

import { aboutSection } from "./constant";

export function AboutSection() {
  return (
    <section className="px-6 pt-32 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-12 mb-16">
          <h2>{aboutSection.title}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {aboutSection.description}
          </p>
        </div>
      </div>
    </section>
  );
}
