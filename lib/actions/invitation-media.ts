"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const MAX_BYTES = 5 * 1024 * 1024;
const mimeSchema = z.enum(["image/jpeg", "image/png", "image/webp"]);
const pathSchema = z.string().min(1).max(500);

const mediaInputSchema = z.object({
  invitationId: z.string().uuid(),
  storagePath: pathSchema,
  fileName: z.string().min(1).max(255),
  mimeType: mimeSchema,
  fileSizeBytes: z.number().int().positive().max(MAX_BYTES),
  width: z.number().int().positive().max(20000).nullable(),
  height: z.number().int().positive().max(20000).nullable(),
});

async function requireOwner(invitationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, invitation: null };
  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, slug")
    .eq("id", invitationId)
    .eq("user_id", user.id)
    .single();
  return { supabase, user, invitation };
}

export async function registerInvitationMedia(input: z.input<typeof mediaInputSchema>) {
  const parsed = mediaInputSchema.safeParse(input);
  if (!parsed.success) return { error: "Metadata gambar tidak valid." };

  const { supabase, user, invitation } = await requireOwner(parsed.data.invitationId);
  if (!user || !invitation) return { error: "Undangan tidak ditemukan." };

  const expectedPrefix = `${user.id}/${invitation.id}/`;
  if (!parsed.data.storagePath.startsWith(expectedPrefix)) {
    return { error: "Lokasi file tidak valid." };
  }

  const { data, error } = await supabase
    .from("invitation_media")
    .insert({
      invitation_id: invitation.id,
      storage_path: parsed.data.storagePath,
      file_name: parsed.data.fileName,
      mime_type: parsed.data.mimeType,
      file_size_bytes: parsed.data.fileSizeBytes,
      width: parsed.data.width,
      height: parsed.data.height,
    })
    .select("*")
    .single();

  if (error) {
    await supabase.storage.from("invitation-media").remove([parsed.data.storagePath]);
    console.error("registerInvitationMedia failed", error);
    return { error: "Metadata gambar gagal disimpan." };
  }

  revalidatePath(`/dashboard/invitations/${invitation.id}/builder`);
  revalidatePath(`/undangan/${invitation.slug}`);
  return { success: true, media: data };
}

export async function deleteInvitationMedia(mediaId: string) {
  const parsed = z.string().uuid().safeParse(mediaId);
  if (!parsed.success) return { error: "Media tidak valid." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized." };

  const { data: media } = await supabase
    .from("invitation_media")
    .select("id, storage_path, invitation_id, invitations!inner(id, slug, user_id)")
    .eq("id", parsed.data)
    .eq("invitations.user_id", user.id)
    .single();

  if (!media) return { error: "Media tidak ditemukan." };

  const { error: storageError } = await supabase.storage
    .from("invitation-media")
    .remove([media.storage_path]);

  if (storageError) {
    console.error("deleteInvitationMedia storage failed", storageError);
    return { error: "File gambar gagal dihapus." };
  }

  const { error } = await supabase.from("invitation_media").delete().eq("id", media.id);
  if (error) return { error: "Metadata gambar gagal dihapus." };

  revalidatePath(`/dashboard/invitations/${media.invitation_id}/builder`);
  revalidatePath(`/undangan/${(media.invitations as { slug: string }).slug}`);
  return { success: true };
}
