"use client";

import { FadeLeft, Item, Stagger } from "@/components/motion";

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
              More Than an Invitation
            </h2>
          </FadeLeft>

          <Item>
            <p className="max-w-md mx-auto text-muted-foreground">
              Satu tempat untuk berbagi cerita, detail acara, dan momen yang
              berarti sebelum hari istimewa tiba.
            </p>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
