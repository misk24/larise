import { InvitationGallery } from "../invitation-gallery";
import type { SectionContext } from "./section-registry";

export function GallerySection({ section, invitation }: SectionContext) {
  const images = Array.isArray(section.content.images)
    ? section.content.images.filter(
        (item): item is string => typeof item === "string",
      )
    : invitation.gallery_photos || [];

  return <InvitationGallery images={images} />;
}
