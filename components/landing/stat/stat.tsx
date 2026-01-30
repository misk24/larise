"use client";

import { stats } from "./constant";

export function StatSection() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-xl mx-auto">
        <div className="grid grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="mb-2">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
