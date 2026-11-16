import { coupleNames } from "@/components/backend/invitation-meta";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PickerInvitation {
  id: string;
  slug: string;
  groom_name?: string | null;
  bride_name?: string | null;
  name_order?: string | null;
}

interface BackendInvitationPickerProps {
  /** Page the GET form reloads, e.g. "/dashboard/guests". The choice travels as ?invitation=<id>. */
  action: string;
  invitations: PickerInvitation[];
  selectedId: string;
}

/** Switches between a user's invitations on pages that work per invitation. Hidden when there is only one. */
export function BackendInvitationPicker({ action, invitations, selectedId }: BackendInvitationPickerProps) {
  if (invitations.length < 2) return null;
  const id = `${action.split("/").filter(Boolean).pop()}-invitation`;

  return (
    <form action={action} method="get" className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Label htmlFor={id}>Pilih undangan</Label>
      <select
        id={id}
        name="invitation"
        defaultValue={selectedId}
        className="h-9 min-w-0 rounded-md border border-input bg-card px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:min-w-72"
      >
        {invitations.map((item) => (
          <option key={item.id} value={item.id}>
            {coupleNames(item)} · /{item.slug}
          </option>
        ))}
      </select>
      <Button type="submit" variant="secondary">Tampilkan</Button>
    </form>
  );
}
