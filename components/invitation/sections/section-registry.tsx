import type { ComponentType } from "react";
import type { Invitation, InvitationSection, Theme, Wish } from "@/types/database";
import type { SectionType } from "./types";
import { CoverSection } from "./cover";
import { OpeningSection } from "./opening";
import { CoupleSection } from "./couple";
import { QuoteSection } from "./quote";
import { EventSection } from "./event";
import { CountdownSection } from "./countdown";
import { GallerySection } from "./gallery";
import { LocationSection } from "./location";
import { ClosingSection } from "./closing";
import { RsvpSection } from "./rsvp";
import { WishesSection } from "./wishes";
import { GiftSection } from "./gift";

export interface SectionContext {
  invitation: Invitation & { themes?: Theme | null };
  section: InvitationSection;
  guestName: string;
  wishes: Wish[];
  onWishAdded?: (wish: Wish) => void;
}

export type SectionComponent = ComponentType<SectionContext>;
export const sectionRegistry: Record<SectionType, SectionComponent> = {
  cover:CoverSection, opening:OpeningSection, couple:CoupleSection, quote:QuoteSection,
  event:EventSection, countdown:CountdownSection, gallery:GallerySection, location:LocationSection,
  closing:ClosingSection, rsvp:RsvpSection, wishes:WishesSection, gift:GiftSection,
};
