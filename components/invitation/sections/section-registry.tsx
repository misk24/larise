import type {
  Invitation,
  InvitationSection,
  Theme,
  Wish,
} from "@/types/database";
import type { ComponentType } from "react";
import { ClosingSection } from "./closing";
import { CountdownSection } from "./countdown";
import { CoupleSection } from "./couple";
import { CoverSection } from "./cover";
import { EventSection } from "./event";
import { GallerySection } from "./gallery";
import { GiftSection } from "./gift";
import { LocationSection } from "./location";
import { OpeningSection } from "./opening";
import { QuoteSection } from "./quote";
import { RsvpSection } from "./rsvp";
import type { SectionType } from "./types";

export interface SectionContext {
  invitation: Invitation & { themes?: Theme | null };
  section: InvitationSection;
  guestName: string;
  wishes: Wish[];
  onWishAdded?: (wish: Wish) => void;
}

export type SectionComponent = ComponentType<SectionContext>;
export const sectionRegistry: Record<SectionType, SectionComponent> = {
  cover: CoverSection,
  opening: OpeningSection,
  couple: CoupleSection,
  quote: QuoteSection,
  event: EventSection,
  countdown: CountdownSection,
  gallery: GallerySection,
  location: LocationSection,
  closing: ClosingSection,
  rsvp: RsvpSection,
  gift: GiftSection,
};
