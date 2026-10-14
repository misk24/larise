"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const wishIdSchema = z.string().uuid();

async function getOwnedInvitationForWish(wishId: string) {
  const parsed = wishIdSchema.safeParse(wishId);
  if (!parsed.success) return { supabase: null, wish: null };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase: null, wish: null };

  const { data: wish } = await supabase
    .from("wishes")
    .select("id, invitation_id")
    .eq("id", parsed.data)
    .maybeSingle();

  if (!wish) return { supabase: null, wish: null };

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id")
    .eq("id", wish.invitation_id)
    .eq("user_id", user.id)
    .maybeSingle();

  return invitation ? { supabase, wish } : { supabase: null, wish: null };
}

export async function setWishVisibility(wishId: string, visibility: "visible" | "hidden") {
  if (visibility !== "visible" && visibility !== "hidden") {
    return { success: false, error: "Status visibilitas tidak valid." };
  }

  const { supabase, wish } = await getOwnedInvitationForWish(wishId);
  if (!supabase || !wish) return { success: false, error: "Ucapan tidak ditemukan atau akses ditolak." };

  const { error } = await supabase.from("wishes").update({ visibility }).eq("id", wish.id);
  if (error) return { success: false, error: "Gagal memperbarui visibilitas ucapan." };

  revalidatePath("/dashboard/wishes");
  revalidatePath("/undangan");
  return { success: true };
}

export async function deleteWish(wishId: string) {
  const { supabase, wish } = await getOwnedInvitationForWish(wishId);
  if (!supabase || !wish) return { success: false, error: "Ucapan tidak ditemukan atau akses ditolak." };

  const { error } = await supabase.from("wishes").delete().eq("id", wish.id);
  if (error) return { success: false, error: "Gagal menghapus ucapan." };

  revalidatePath("/dashboard/wishes");
  return { success: true };
}
