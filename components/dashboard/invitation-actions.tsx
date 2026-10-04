"use client";

import { Button } from "@/components/ui/button";
import { duplicateInvitation, deleteInvitation, setInvitationPublished } from "@/lib/actions/invitations";
import { Copy, Eye, Loader2, Trash2 } from "lucide-react";
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
      toast.success("Perubahan berhasil disimpan.");
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/dashboard/invitations/${invitationId}`}>Edit</Link>
      </Button>
      <Button variant="outline" size="sm" disabled={loading !== null} onClick={() => run(() => duplicateInvitation(invitationId))}>
        {loading ? <Loader2 className="mr-2 size-3 animate-spin" /> : <Copy className="mr-2 size-3" />}
        Duplikat
      </Button>
      <Button variant="outline" size="sm" disabled={loading !== null} onClick={() => run(() => setInvitationPublished(invitationId, !published))}>
        <Eye className="mr-2 size-3" />
        {published ? "Unpublish" : "Publish"}
      </Button>
      <Button variant="destructive" size="sm" disabled={loading !== null} onClick={() => {
        if (window.confirm("Hapus undangan ini? Data turunannya juga akan ikut terhapus.")) {
          void run(() => deleteInvitation(invitationId));
        }
      }}>
        <Trash2 className="mr-2 size-3" />
        Hapus
      </Button>
    </div>
  );
}
