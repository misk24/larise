"use client";

import { useEffect, useState } from "react";
import type { SectionContext } from "./section-registry";
import { SectionShell } from "./section-shell";
import { contentValue } from "./content-utils";

export function CountdownSection({ section, invitation }: SectionContext) {
  const target = contentValue(
    section.content,
    "target_date",
    invitation.resepsi_date || invitation.akad_date || "",
  );
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const end = new Date(target).getTime();
  const distance = Number.isFinite(end) ? Math.max(0, end - now) : 0;
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor(distance / 3600000) % 24;
  const minutes = Math.floor(distance / 60000) % 60;
  const seconds = Math.floor(distance / 1000) % 60;

  return (
    <SectionShell className="bg-secondary/30 text-center">
      <h2 className="font-serif text-2xl md:text-3xl">
        {contentValue(section.content, "title", "Menuju Hari Bahagia")}
      </h2>
      <div className="mx-auto mt-8 grid max-w-xl grid-cols-4 gap-2 md:gap-4">
        {[[days, "Hari"], [hours, "Jam"], [minutes, "Menit"], [seconds, "Detik"]].map(
          ([value, label]) => (
            <div key={label} className="rounded-lg border p-4">
              <div className="text-2xl font-semibold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ),
        )}
      </div>
    </SectionShell>
  );
}
