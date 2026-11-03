import { InvitationRsvp } from "../invitation-rsvp";
import type { SectionContext } from "./section-registry";

export function RsvpSection({ invitation, guestName, guestToken, wishes, onWishAdded }: SectionContext) {
  return <InvitationRsvp invitationId={invitation.id} guestName={guestName} guestToken={guestToken} wishes={wishes} onWishAdded={onWishAdded} />;
}
