"use client";
import { useState } from "react";
import type { Invitation, InvitationSection, Theme, Wish } from "@/types/database";
import { sectionRegistry } from "./sections/section-registry";
import { invitationSectionSchema } from "./sections/types";

interface Props {
  invitation: Invitation & { themes?: Theme | null };
  sections: InvitationSection[];
  guestName: string;
  wishes: Wish[];
}

export function SharedInvitationRenderer({ invitation, sections, guestName, wishes: initialWishes }: Props) {
  const [wishes, setWishes] = useState(initialWishes);
  const ordered = sections
    .filter((section) => invitationSectionSchema.safeParse(section).success && section.is_visible)
    .sort((a, b) => a.position - b.position);

  return (
    <main className="min-h-screen">
      {invitation.background_music_url && (
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-6 text-center">
          <p className="text-sm font-medium">Musik Latar</p>
          <audio
            controls
            preload="none"
            src={invitation.background_music_url}
            aria-label="Musik latar undangan"
            className="w-full max-w-md"
          >
            Browser Anda tidak mendukung pemutar audio.
          </audio>
        </div>
      )}
      {ordered.map((section) => {
        const Component = sectionRegistry[section.section_type as keyof typeof sectionRegistry];
        if (!Component) return null;
        return (
          <Component
            key={section.id}
            invitation={invitation}
            section={section}
            guestName={guestName}
            wishes={wishes}
            onWishAdded={(wish) => setWishes((prev) => [wish, ...prev])}
          />
        );
      })}
    </main>
  );
}
