"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { registerInvitationMedia, deleteInvitationMedia } from "@/lib/actions/invitation-media";
import type { InvitationMedia } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"] as const;

function extensionFor(type: string) {
  return type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : "webp";
}

export function InvitationMediaUploader({
  invitationId,
  initialMedia,
  onChange,
}: {
  invitationId: string;
  initialMedia: InvitationMedia[];
  onChange?: (media: InvitationMedia[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState(initialMedia);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  function update(next: InvitationMedia[]) {
    setMedia(next);
    onChange?.(next);
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const supabase = createClient();
      for (const file of Array.from(files)) {
        if (!ACCEPTED.includes(file.type as typeof ACCEPTED[number])) {
          toast.error(`${file.name}: format harus JPG, PNG, atau WebP.`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          toast.error(`${file.name}: ukuran maksimum 5 MB.`);
          continue;
        }

        const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
          const url = URL.createObjectURL(file);
          const image = new Image();
          image.onload = () => { URL.revokeObjectURL(url); resolve({ width: image.naturalWidth, height: image.naturalHeight }); };
          image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Gambar tidak dapat dibaca.")); };
          image.src = url;
        });

        const path = `${invitationId}/${crypto.randomUUID()}.${extensionFor(file.type)}`;
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) throw new Error("Sesi login berakhir. Silakan login lagi.");
        const storagePath = `${auth.user.id}/${path}`;

        const { error: uploadError } = await supabase.storage
          .from("invitation-media")
          .upload(storagePath, file, { contentType: file.type, upsert: false, cacheControl: "31536000" });

        if (uploadError) {
          toast.error(`${file.name}: upload gagal.`);
          continue;
        }

        const { data } = supabase.storage.from("invitation-media").getPublicUrl(storagePath);
        const result = await registerInvitationMedia({
          invitationId,
          storagePath,
          fileName: file.name,
          mimeType: file.type as "image/jpeg" | "image/png" | "image/webp",
          fileSizeBytes: file.size,
          width: dimensions.width,
          height: dimensions.height,
        });

        if (result.error || !result.media) {
          toast.error(result.error ?? "Metadata gambar gagal disimpan.");
          continue;
        }

        update([...media, { ...result.media, public_url: data.publicUrl } as InvitationMedia]);
      }
      toast.success("Upload selesai.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload gagal.");
    } finally {
      setUploading(false);
    }
  }

  function remove(item: InvitationMedia) {
    startTransition(async () => {
      const result = await deleteInvitationMedia(item.id);
      if (result.error) { toast.error(result.error); return; }
      update(media.filter((entry) => entry.id !== item.id));
      toast.success("Gambar dihapus.");
    });
  }

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" accept={ACCEPTED.join(",")} multiple hidden onChange={(e) => handleFiles(e.target.files)} />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading || pending}>
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        {uploading ? "Mengunggah..." : "Upload gambar"}
      </Button>
      <p className="text-xs text-muted-foreground">JPG, PNG, WebP. Maksimum 5 MB per gambar.</p>
      {media.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {media.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-md border bg-muted">
              <img src={(item as InvitationMedia & { public_url?: string }).public_url ?? ""} alt={item.file_name} className="aspect-square w-full object-cover" />
              <button type="button" onClick={() => remove(item)} disabled={pending} className="absolute right-1 top-1 rounded-md bg-background/90 p-1.5 opacity-0 shadow transition group-hover:opacity-100" aria-label={`Hapus ${item.file_name}`}>
                <Trash2 className="size-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
