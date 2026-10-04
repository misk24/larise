import type { Invitation, InvitationSection, Theme, Wish } from "@/types/database";
import { SharedInvitationRenderer } from "./shared-renderer";
interface Props { invitation: Invitation & { themes?: Theme | null }; sections: InvitationSection[]; guestName: string; wishes: Wish[]; }
export function InvitationView({invitation,sections,guestName,wishes}:Props) { return <SharedInvitationRenderer invitation={invitation} sections={sections} guestName={guestName} wishes={wishes}/>; }
