"use client";

import { FadeLeft, FadeUp } from "@/components/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquareIcon } from "lucide-react";
import { featureSection } from "./constant";

export function FeatureSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="px-6 py-24 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <FadeLeft>
          <h2 id="features-title" className="mb-16 md:text-center">
            {featureSection.title}
          </h2>
        </FadeLeft>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {featureSection.features.map((feature, index) => (
            <FadeUp key={index}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>
                    <h3>{feature.title}</h3>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckSquareIcon className="size-4" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
