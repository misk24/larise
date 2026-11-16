"use client";

import { ConfirmDialog } from "@/components/backend/confirm-dialog";
import { Button } from "@/components/ui/button";
import { duplicateInvitation, deleteInvitation, setInvitationPublished } from "@/lib/actions/invitations";
import { Copy, Eye, Loader2, Pencil, PanelsTopLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function InvitationActions({
  invitationId,
  published,
}: {
  invitationId: string;
  published: boolean;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function run(action: () => Promise<{ error?: string; success?: boolean; id?: string }>) {
    setLoading("action");
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
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" asChild>
        <Link href={`/dashboard/invitations/${invitationId}/builder`}><PanelsTopLeft />Edit keseluruhan</Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/dashboard/invitations/${invitationId}`}><Pencil />Edit info dasar</Link>
      </Button>
      <Button variant="outline" size="sm" disabled={loading !== null} onClick={() => run(() => setInvitationPublished(invitationId, !published))}>
        <Eye />
        {published ? "Unpublish" : "Publish"}
      </Button>
      <Button variant="ghost" size="sm" disabled={loading !== null} onClick={() => run(() => duplicateInvitation(invitationId))}>
        {loading ? <Loader2 className="animate-spin" /> : <Copy />}
        Duplikat
      </Button>
      <ConfirmDialog
        title="Hapus undangan ini?"
        description="Data turunannya (tamu, RSVP, ucapan) juga akan ikut terhapus."
        onConfirm={() => void run(() => deleteInvitation(invitationId))}
        trigger={
          <Button variant="ghost" size="sm" disabled={loading !== null} className="text-destructive hover:bg-destructive-muted hover:text-destructive">
            <Trash2 />
            Hapus
          </Button>
        }
      />
    </div>
  );
}
