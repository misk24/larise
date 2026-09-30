"use client";

import { FadeLeft, Item, Stagger } from "@/components/motion";
import { valueSection } from "./constant";

export function ValueSection() {
  return (
    <section
      id="value"
      aria-labelledby="value-title"
      className="px-6 py-24 md:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <Stagger className="md:text-center">
          <FadeLeft>
            <h2 id="value-title" className="mb-6">
              {valueSection.title}
            </h2>
          </FadeLeft>

          <Item>
            <p className="max-w-md mx-auto text-muted-foreground">
              {valueSection.description}
            </p>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
