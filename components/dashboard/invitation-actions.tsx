"use client";

import { ConfirmDialog } from "@/components/backend/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { duplicateInvitation, deleteInvitation, setInvitationPublished } from "@/lib/actions/invitations";
import { Copy, Eye, EyeOff, Loader2, MoreHorizontal, Pencil, PanelsTopLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Pending = "publish" | "duplicate" | "delete";

export function InvitationActions({
  invitationId,
  published,
}: {
  invitationId: string;
  published: boolean;
}) {
  const [pending, setPending] = useState<Pending | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  async function run(key: Pending, action: () => Promise<{ error?: string; success?: boolean; id?: string }>) {
    setPending(key);
    try {
      const result = await action();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (!result.success && !result.id) {
        toast.error("Tindakan belum berhasil diselesaikan. Coba lagi.");
        return;
      }
      toast.success(result.id ? "Undangan berhasil diduplikasi." : "Perubahan berhasil disimpan.");
      router.refresh();
    } catch {
      toast.error("Tindakan gagal diproses. Periksa koneksi lalu coba lagi.");
    } finally {
      setPending(null);
    }
  }

  const busy = pending !== null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-busy={busy}>
      <Button size="sm" asChild>
        <Link href={`/dashboard/invitations/${invitationId}/builder`}><PanelsTopLeft />Edit keseluruhan</Link>
      </Button>
      <Button variant="outline" size="sm" disabled={busy} onClick={() => run("publish", () => setInvitationPublished(invitationId, !published))}>
        {pending === "publish" ? <Loader2 className="animate-spin" /> : published ? <EyeOff /> : <Eye />}
        {published ? "Unpublish" : "Publish"}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={busy} aria-label="Aksi lainnya">
            {busy && pending !== "publish" ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
            Lainnya
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/invitations/${invitationId}`}><Pencil />Edit info dasar</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void run("duplicate", () => duplicateInvitation(invitationId))}>
            <Copy />Duplikat
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setConfirmDelete(true)}>
            <Trash2 />Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Hapus undangan ini?"
        description="Data turunannya (tamu, RSVP, ucapan) juga akan ikut terhapus."
        onConfirm={() => void run("delete", () => deleteInvitation(invitationId))}
      />
    </div>
  );
}
