"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  buildInvitationSlug,
  invitationInputSchema,
  invitationSettingsSchema,
  normalizeSlug,
} from "@/lib/validation/invitation";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null };
  return { supabase, user };
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseSlug: string,
  excludeId?: string,
) {
  const normalized = normalizeSlug(baseSlug) || `undangan-${Date.now()}`;
  let candidate = normalized;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    let query = supabase
      .from("invitations")
      .select("id")
      .eq("slug", candidate)
      .limit(1);

    if (excludeId) query = query.neq("id", excludeId);

    const { data, error } = await query;
    if (error) throw new Error("Gagal memeriksa URL undangan.");
    if (!data?.length) return candidate;

    candidate = `${normalized}-${attempt + 2}`;
  }

  throw new Error("Tidak dapat membuat URL undangan yang unik.");
}

export async function createInvitation(input: z.input<typeof invitationInputSchema>) {
  const parsed = invitationInputSchema.safeParse(input);
  if (!parsed.success) return { error: "Data undangan belum lengkap." };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Sesi login tidak valid." };

  const { data: theme, error: themeError } = await supabase
    .from("themes")
    .select("id")
    .eq("id", parsed.data.themeId)
    .eq("is_active", true)
    .maybeSingle();

  if (themeError || !theme) return { error: "Tema tidak tersedia." };

  try {
    const slug = await uniqueSlug(
      supabase,
      parsed.data.slug || buildInvitationSlug(parsed.data.groomName, parsed.data.brideName),
    );

    const { data: invitation, error } = await supabase
      .from("invitations")
      .insert({
        user_id: user.id,
        theme_id: theme.id,
        slug,
        status: "draft",
        is_published: false,
      })
      .select("id")
      .single();

    if (error || !invitation) {
      console.error("createInvitation failed", error);
      return { error: "Undangan gagal dibuat." };
    }

    const { error: cloneError } = await supabase.rpc(
      "clone_theme_sections_to_invitation",
      { p_theme_id: theme.id, p_invitation_id: invitation.id },
    );

    if (cloneError) {
      await supabase.from("invitations").delete().eq("id", invitation.id);
      console.error("clone theme sections failed", cloneError);
      return { error: "Struktur tema gagal disiapkan." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/invitations");
    redirect(`/dashboard/invitations/${invitation.id}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) throw error;
    console.error("createInvitation unexpected error", error);
    return { error: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export async function updateInvitation(
  invitationId: string,
  input: z.input<typeof invitationSettingsSchema>,
) {
  const parsed = invitationSettingsSchema.safeParse(input);
  if (!parsed.success || !z.string().uuid().safeParse(invitationId).success) {
    return { error: "Data undangan tidak valid." };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Sesi login tidak valid." };

  const { data: theme } = await supabase
    .from("themes")
    .select("id")
    .eq("id", parsed.data.themeId)
    .eq("is_active", true)
    .maybeSingle();

  if (!theme) return { error: "Tema tidak tersedia." };

  try {
    const slug = await uniqueSlug(supabase, parsed.data.slug, invitationId);

    const { data: current } = await supabase
      .from("invitations")
      .select("theme_id")
      .eq("id", invitationId)
      .eq("user_id", user.id)
      .single();

    if (!current) return { error: "Undangan tidak ditemukan." };

    const { error } = await supabase
      .from("invitations")
      .update({ theme_id: theme.id, slug, groom_name: parsed.data.groomName, bride_name: parsed.data.brideName })
      .eq("id", invitationId)
      .eq("user_id", user.id);

    if (error) {
      console.error("updateInvitation failed", error);
      return { error: "Undangan gagal disimpan." };
    }

    if (current.theme_id !== theme.id) {
      const { error: cloneError } = await supabase.rpc(
        "clone_theme_sections_to_invitation",
        { p_theme_id: theme.id, p_invitation_id: invitationId },
      );
      if (cloneError) return { error: "Struktur tema gagal diperbarui." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/invitations");
    revalidatePath(`/dashboard/invitations/${invitationId}`);
    return { success: true };
  } catch (error) {
    console.error("updateInvitation unexpected error", error);
    return { error: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export async function setInvitationPublished(invitationId: string, published: boolean) {
  if (!z.string().uuid().safeParse(invitationId).success) {
    return { error: "ID undangan tidak valid." };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Sesi login tidak valid." };

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, theme_id, slug")
    .eq("id", invitationId)
    .eq("user_id", user.id)
    .single();

  if (!invitation) return { error: "Undangan tidak ditemukan." };

  if (published && !invitation.theme_id) return { error: "Pilih tema sebelum menerbitkan." };

  const { error } = await supabase
    .from("invitations")
    .update({
      status: published ? "published" : "unpublished",
      is_published: published,
    })
    .eq("id", invitationId)
    .eq("user_id", user.id);

  if (error) return { error: "Status undangan gagal diperbarui." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invitations");
  revalidatePath(`/dashboard/invitations/${invitationId}`);
  return { success: true };
}

export async function deleteInvitation(invitationId: string) {
  if (!z.string().uuid().safeParse(invitationId).success) {
    return { error: "ID undangan tidak valid." };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Sesi login tidak valid." };

  const { error } = await supabase
    .from("invitations")
    .delete()
    .eq("id", invitationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("deleteInvitation failed", error);
    return { error: "Undangan gagal dihapus." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invitations");
  return { success: true };
}

export async function duplicateInvitation(invitationId: string) {
  if (!z.string().uuid().safeParse(invitationId).success) {
    return { error: "ID undangan tidak valid." };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Sesi login tidak valid." };

  const { data: source } = await supabase
    .from("invitations")
    .select("id, theme_id, slug")
    .eq("id", invitationId)
    .eq("user_id", user.id)
    .single();

  if (!source) return { error: "Undangan tidak ditemukan." };

  try {
    const slug = await uniqueSlug(supabase, `${source.slug}-copy`);

    const { data: copy, error } = await supabase
      .from("invitations")
      .insert({
        user_id: user.id,
        theme_id: source.theme_id,
        slug,
        status: "draft",
        is_published: false,
      })
      .select("id")
      .single();

    if (error || !copy) {
      console.error("duplicateInvitation insert failed", error);
      return { error: "Duplikasi undangan gagal." };
    }

    if (source.theme_id) {
      const { error: cloneError } = await supabase.rpc(
        "clone_theme_sections_to_invitation",
        { p_theme_id: source.theme_id, p_invitation_id: copy.id },
      );
      if (cloneError) {
        await supabase.from("invitations").delete().eq("id", copy.id);
        return { error: "Struktur tema gagal disalin." };
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/invitations");
    return { success: true, id: copy.id };
  } catch (error) {
    console.error("duplicateInvitation unexpected error", error);
    return { error: "Terjadi kesalahan. Silakan coba lagi." };
  }
}
