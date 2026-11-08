"use client";
import type {
  Invitation,
  InvitationSection,
  Theme,
  Wish,
} from "@/types/database";
import { useState } from "react";
import {
  getSectionDesignAttributes,
  getSectionDesignStyle,
} from "./sections/section-design";
import { sectionRegistry } from "./sections/section-registry";
import { invitationSectionSchema } from "./sections/types";

interface Props {
  invitation: Invitation & { themes?: Theme | null };
  sections: InvitationSection[];
  guestName: string;
  guestToken: string | null;
  wishes: Wish[];
}

export function SharedInvitationRenderer({
  invitation,
  sections,
  guestName,
  guestToken,
  wishes: initialWishes,
}: Props) {
  const [wishes, setWishes] = useState(initialWishes);
  const ordered = sections
    .filter(
      (section) =>
        invitationSectionSchema.safeParse(section).success &&
        section.is_visible,
    )
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
        const Component =
          sectionRegistry[section.section_type as keyof typeof sectionRegistry];
        if (!Component) return null;
        const design = section.content.design;
        return (
          <div
            key={section.id}
            className="section-design-scope"
            {...getSectionDesignAttributes(design)}
            style={getSectionDesignStyle(design)}
          >
            <Component
              invitation={invitation}
              section={section}
              guestName={guestName}
              guestToken={guestToken}
              wishes={wishes}
              onWishAdded={(wish) => setWishes((prev) => [wish, ...prev])}
            />
          </div>
        );
      })}
    </main>
  );
}
