import { InvitationRsvp } from "../invitation-rsvp";
import type { SectionContext } from "./section-registry";
export function RsvpSection({invitation,guestName,wishes,onWishAdded}:SectionContext) { return <InvitationRsvp invitationId={invitation.id} guestName={guestName} wishes={wishes} onWishAdded={onWishAdded} />; }
