import { InvitationGallery } from "../invitation-gallery";
import type { SectionContext } from "./section-registry";
import { contentValue } from "./content-utils";
export function GallerySection({section,invitation}:SectionContext) { const images=Array.isArray(section.content.images)?section.content.images.filter((x):x is string=>typeof x==="string"):(invitation.gallery_photos||[]); return <InvitationGallery images={images} />; }
