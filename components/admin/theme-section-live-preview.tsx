"use client";

import {
  getSectionDesignAttributes,
  getSectionDesignStyle,
} from "@/components/invitation/sections/section-design";
import { sectionRegistry } from "@/components/invitation/sections/section-registry";
import type { Invitation, InvitationSection, Wish } from "@/types/database";

const previewInvitation = {
  id: "00000000-0000-4000-8000-000000000001",
  user_id: "00000000-0000-4000-8000-000000000002",
  theme_id: null,
  slug: "preview-undangan",
  name_order: "groom_first",
  groom_name: "Arkan Pratama",
  groom_nickname: "Arkan",
  groom_father: "Bapak Pratama",
  groom_mother: "Ibu Pratama",
  groom_photo_url: null,
  bride_name: "Nadia Putri",
  bride_nickname: "Nadia",
  bride_father: "Bapak Putri",
  bride_mother: "Ibu Putri",
  bride_photo_url: null,
  couple_photo_url: null,
  event_date: "2027-06-12",
  akad_date: "2027-06-12",
  akad_time: "08.00 WITA",
  akad_location: "Kediaman Mempelai Wanita",
  akad_address: "Jl. Contoh No. 12",
  akad_maps_url: null,
  resepsi_date: "2027-06-12",
  resepsi_time: "11.00–14.00 WITA",
  resepsi_location: "Gedung Serbaguna",
  resepsi_address: "Jl. Merdeka No. 10",
  resepsi_maps_url: null,
  love_story: null,
  opening_text: "Dengan penuh kebahagiaan kami mengundang Anda.",
  closing_text: "Merupakan kehormatan bagi kami atas kehadiran Anda.",
  gallery_photos: [],
  background_music_url: null,
  show_countdown: true,
  show_gallery: true,
  show_love_story: false,
  show_gift: false,
  show_rsvp: false,
  bank_accounts: [],
  gift_address: null,
  status: "draft",
  is_published: false,
  view_count: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
} as Invitation;

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
  const Component =
    sectionRegistry[sectionType as keyof typeof sectionRegistry];
  if (!Component) {
    return (
      <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        Belum ada renderer untuk section ini.
      </p>
    );
  }

  if (sectionType === "rsvp" || sectionType === "gift") {
    return (
      <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        Preview interaktif untuk section {sectionType} dinonaktifkan agar tidak
        mengirim data sungguhan.
      </p>
    );
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
    <div
      className="section-design-scope overflow-hidden rounded-md border"
      {...getSectionDesignAttributes(design)}
      style={getSectionDesignStyle(design)}
    >
      <Component
        invitation={previewInvitation}
        section={section}
        guestName="Tamu Undangan"
        wishes={previewWishes}
      />
    </div>
  );
}
