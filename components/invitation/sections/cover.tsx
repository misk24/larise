import type { SectionContext } from "./section-registry";
import { SectionShell } from "./section-shell";
import { contentValue } from "./content-utils";

export function CoverSection({ section, invitation }: SectionContext) {
  const content = section.content;
  const firstName = invitation.name_order === "bride_first" ? invitation.bride_name : invitation.groom_name;
  const secondName = invitation.name_order === "bride_first" ? invitation.groom_name : invitation.bride_name;
  const configuredTitle = contentValue(content, "title", "");
  const title = !configuredTitle || configuredTitle === "Nama Pasangan"
    ? `${firstName} & ${secondName}`
    : configuredTitle;

  return (
    <SectionShell className="flex min-h-[80vh] items-center justify-center text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          {contentValue(content, "eyebrow", "The Wedding of")}
        </p>
        <h1 className="mt-6 font-serif text-5xl font-semibold md:text-7xl">{title}</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          {contentValue(content, "subtitle", "Dengan penuh kebahagiaan kami mengundang Anda.")}
        </p>
      </div>
    </SectionShell>
  );
}
