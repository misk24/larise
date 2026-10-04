import { InvitationWishes } from "../invitation-wishes";
import type { SectionContext } from "./section-registry";
export function WishesSection({invitation,wishes,onWishAdded}:SectionContext) { return <InvitationWishes invitationId={invitation.id} wishes={wishes} onWishAdded={wish=>onWishAdded?.(wish)} />; }
