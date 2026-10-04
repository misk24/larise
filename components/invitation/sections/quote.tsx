import type { SectionContext } from "./section-registry";
import { SectionShell } from "./section-shell";
import { contentValue } from "./content-utils";
export function QuoteSection({section}:SectionContext) { const c=section.content; return <SectionShell className="text-center bg-secondary/30"><blockquote className="mx-auto max-w-3xl text-2xl md:text-3xl font-serif leading-relaxed">“{contentValue(c,"quote")}”</blockquote>{contentValue(c,"author")&&<p className="mt-5 text-sm text-muted-foreground">— {contentValue(c,"author")}</p>}</SectionShell>; }
