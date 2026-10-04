import type { SectionContext } from "./section-registry";
import { SectionShell } from "./section-shell";
import { contentValue } from "./content-utils";
export function OpeningSection({section}:SectionContext) { const c=section.content; return <SectionShell className="text-center"><h2 className="text-3xl md:text-4xl font-serif font-semibold">{contentValue(c,"title","Dengan penuh kebahagiaan")}</h2><p className="mx-auto mt-6 max-w-2xl whitespace-pre-line leading-8 text-muted-foreground">{contentValue(c,"body")}</p></SectionShell>; }
