import type { SectionContext } from "./section-registry";
import { SectionShell } from "./section-shell";
import { contentValue } from "./content-utils";

export function CoupleSection({ section, invitation }: SectionContext) {
  const content = section.content;
  const groomName = contentValue(content, "groom_name", "");
  const brideName = contentValue(content, "bride_name", "");
  const displayedGroomName = !groomName || groomName === "Nama Mempelai Pria" ? invitation.groom_name : groomName;
  const displayedBrideName = !brideName || brideName === "Nama Mempelai Wanita" ? invitation.bride_name : brideName;
  const couple = invitation.name_order === "bride_first"
    ? [
        { name: displayedBrideName, parents: contentValue(content, "bride_parents", "") },
        { name: displayedGroomName, parents: contentValue(content, "groom_parents", "") },
      ]
    : [
        { name: displayedGroomName, parents: contentValue(content, "groom_parents", "") },
        { name: displayedBrideName, parents: contentValue(content, "bride_parents", "") },
      ];

  return (
    <SectionShell className="text-center">
      <h2 className="font-serif text-3xl font-semibold md:text-4xl">{contentValue(content, "title", "Mempelai")}</h2>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {couple.map((person, index) => (
          <div key={index}>
            <h3 className="font-serif text-2xl">{person.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{person.parents}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
