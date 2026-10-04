import { InvitationRsvp } from "../invitation-rsvp";
import type { SectionContext } from "./section-registry";
export function RsvpSection({invitation,guestName}:SectionContext) { return <InvitationRsvp invitationId={invitation.id} guestName={guestName} />; }
