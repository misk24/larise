import type { SectionContext } from "./section-registry";
import { SectionShell } from "./section-shell";
import { contentValue } from "./content-utils";

export function EventSection({ section, invitation }: SectionContext) {
  const content = section.content;
  const date = contentValue(content, "date") || "";
  const displayDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : date;
  const time = contentValue(content, "time") || invitation.resepsi_time || invitation.akad_time || "";
  const venue = contentValue(content, "venue") || invitation.resepsi_location || invitation.akad_location || "";
  const address = contentValue(content, "address") || invitation.resepsi_address || invitation.akad_address || "";

  return (
    <SectionShell className="text-center">
      <h2 className="font-serif text-3xl font-semibold md:text-4xl">{contentValue(content, "title", "Acara")}</h2>
      <div className="mt-8 space-y-3 text-muted-foreground">
        <p>{displayDate}</p>
        <p>{time}</p>
        <p className="font-medium text-foreground">{venue}</p>
        <p>{address}</p>
      </div>
    </SectionShell>
  );
}
