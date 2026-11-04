"use client";
import { useState } from "react";
import type { Invitation, InvitationSection, Theme, Wish } from "@/types/database";
import { sectionRegistry } from "./sections/section-registry";
import { invitationSectionSchema } from "./sections/types";

interface Props {
  invitation: Invitation & { themes?: Theme | null };
  sections: InvitationSection[];
  guestName: string;
  guestToken: string | null;
  wishes: Wish[];
}

export function SharedInvitationRenderer({ invitation, sections, guestName, guestToken, wishes: initialWishes }: Props) {
  const [wishes, setWishes] = useState(initialWishes);
  const ordered = sections.filter((section) => invitationSectionSchema.safeParse(section).success && section.is_visible).sort((a, b) => a.position - b.position);

  return (
    <main className="min-h-screen">
      {ordered.map((section) => {
        const Component = sectionRegistry[section.section_type as keyof typeof sectionRegistry];
        if (!Component) return null;
        return <Component key={section.id} invitation={invitation} section={section} guestName={guestName} guestToken={guestToken} wishes={wishes} onWishAdded={(wish) => setWishes((prev) => [wish, ...prev])} />;
      })}
    </main>
  );
}
