import type { ReactNode } from "react";
export function SectionShell({children,className=""}:{children:ReactNode;className?:string}) {
 return <section className={`py-20 md:py-28 ${className}`}><div className="container mx-auto max-w-5xl px-6">{children}</div></section>;
}
