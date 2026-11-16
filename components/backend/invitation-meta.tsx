import { BackendStatusBadge } from "@/components/backend/backend-ui";

interface CoupleFields {
  groom_name?: string | null;
  bride_name?: string | null;
  name_order?: string | null;
}

/** "Mempelai A & Mempelai B", respecting the order the owner chose. */
export function coupleNames({ groom_name, bride_name, name_order }: CoupleFields) {
  const groom = groom_name || "Mempelai pria";
  const bride = bride_name || "Mempelai wanita";
  return name_order === "bride_first" ? `${bride} & ${groom}` : `${groom} & ${bride}`;
}

/** One status vocabulary for invitations across dashboard and admin. */
export function InvitationStatusBadge({ published, status }: { published?: boolean; status?: string | null }) {
  if (published || status === "published") return <BackendStatusBadge tone="success">Dipublikasikan</BackendStatusBadge>;
  if (status === "unpublished") return <BackendStatusBadge tone="warning">Tidak dipublikasikan</BackendStatusBadge>;
  if (!status || status === "draft") return <BackendStatusBadge tone="neutral">Draft</BackendStatusBadge>;
  return <BackendStatusBadge tone="info">{status}</BackendStatusBadge>;
}
