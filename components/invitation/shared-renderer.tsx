"use client";
import { useMemo,useState } from "react";
import type { Invitation, InvitationSection, Theme, Wish } from "@/types/database";
import { sectionRegistry } from "./sections/section-registry";
import type { SectionType } from "./sections/types";
import { invitationSectionSchema } from "./sections/types";
interface Props { invitation: Invitation & { themes?: Theme | null }; sections: InvitationSection[]; guestName: string; wishes: Wish[]; }
export function SharedInvitationRenderer({invitation,sections,guestName,wishes:initialWishes}:Props) {
 const [wishes,setWishes]=useState(initialWishes);
 const ordered=useMemo(()=>sections.map(section=>{const parsed=invitationSectionSchema.safeParse(section);return parsed.success?parsed.data:null}).filter((s):s is InvitationSection=>Boolean(s)&&s.is_visible).sort((a,b)=>a.position-b.position),[sections]);
 return <main className="min-h-screen bg-background">{ordered.map(section=>{const Component=sectionRegistry[section.section_type as SectionType];if(!Component)return null;return <Component key={section.id} invitation={invitation} section={section} guestName={guestName} wishes={wishes} onWishAdded={wish=>setWishes(prev=>[wish,...prev])}/>})}</main>;
}
