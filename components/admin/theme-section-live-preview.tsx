"use client";

import type { InvitationSection, Wish } from "@/types/database";
import { previewInvitation } from "@/lib/preview-invitation";
import { sectionRegistry } from "@/components/invitation/sections/section-registry";
import { getSectionDesignAttributes, getSectionDesignStyle } from "@/components/invitation/sections/section-design";


const previewWishes: Wish[] = [];

export function ThemeSectionLivePreview({
  sectionKey,
  sectionType,
  content,
  visible = true,
}: {
  sectionKey: string;
  sectionType: string;
  content: Record<string, unknown>;
  visible?: boolean;
}) {
  const Component = sectionRegistry[sectionType as keyof typeof sectionRegistry];
  if (!Component) {
    return <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">Belum ada renderer untuk section ini.</p>;
  }

  if (sectionType === "rsvp" || sectionType === "gift") {
    return <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">Preview interaktif untuk section {sectionType} dinonaktifkan agar tidak mengirim data sungguhan.</p>;
  }

  const section = {
    id: "00000000-0000-4000-8000-000000000003",
    invitation_id: previewInvitation.id,
    section_key: sectionKey,
    section_type: sectionType,
    position: 0,
    content,
    is_visible: visible,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  } as InvitationSection;
  const design = content.design;

  return (
    <div className="section-design-scope overflow-hidden rounded-md border" {...getSectionDesignAttributes(design)} style={getSectionDesignStyle(design)}>
      <Component
        invitation={previewInvitation}
        section={section}
        guestName="Tamu Undangan"
        guestToken={null}
        wishes={previewWishes}
      />
    </div>
  );
}
