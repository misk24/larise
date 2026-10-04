import type { SectionContext } from "./section-registry";
import { SectionShell } from "./section-shell";
import { contentValue } from "./content-utils";
export function CoverSection({section,invitation}:SectionContext) {
 const c=section.content;
 return <SectionShell className="min-h-[80vh] flex items-center justify-center text-center"><div><p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{contentValue(c,"eyebrow","The Wedding of")}</p><h1 className="mt-6 text-5xl md:text-7xl font-serif font-semibold">{contentValue(c,"title",`${invitation.groom_name} & ${invitation.bride_name}`)}</h1><p className="mt-6 text-lg text-muted-foreground">{contentValue(c,"subtitle","Dengan penuh kebahagiaan kami mengundang Anda.")}</p></div></SectionShell>;
}
