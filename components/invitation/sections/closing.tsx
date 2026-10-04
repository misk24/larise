import type { SectionContext } from "./section-registry";
import { SectionShell } from "./section-shell";
import { contentValue } from "./content-utils";
export function ClosingSection({section}:SectionContext) { const c=section.content; return <SectionShell className="text-center"><h2 className="text-3xl md:text-4xl font-serif">{contentValue(c,"title","Terima kasih")}</h2><p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-muted-foreground">{contentValue(c,"body")}</p></SectionShell>; }
