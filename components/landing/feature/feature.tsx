"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { featureSection } from "./constant";

export function FeatureSection() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-16">{featureSection.title}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {featureSection.features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  <h3>{feature.title}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckSquare className="size-4" /> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
