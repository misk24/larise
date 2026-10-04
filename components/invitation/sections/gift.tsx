import { InvitationGift } from "../invitation-gift";
import type { SectionContext } from "./section-registry";
export function GiftSection({invitation,section}:SectionContext) { const c=section.content; const bank=invitation.bank_accounts?.[0]; if(!bank)return null; return <InvitationGift bankName={contentValue(c,"bank_name",bank.bank)} bankAccount={contentValue(c,"account_number",bank.account_number)} bankHolder={contentValue(c,"account_name",bank.account_name)} />; }
