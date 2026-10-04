"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { invitationSectionSchema, sectionContentSchemas } from "@/components/invitation/sections/types";

const sectionUpdateSchema = z.object({
  id: z.string().uuid(),
  section_key: z.string().min(1),
  section_type: invitationSectionSchema.shape.section_type,
  position: z.number().int().nonnegative(),
  content: z.record(z.unknown()),
  is_visible: z.boolean(),
});

const saveSectionsSchema = z.object({
  invitationId: z.string().uuid(),
  sections: z.array(sectionUpdateSchema).min(1).max(50),
});

async function requireOwner(invitationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, invitation: null };

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id")
    .eq("id", invitationId)
    .eq("user_id", user.id)
    .single();

  return { supabase, user, invitation };
}

export async function saveInvitationSections(input: z.input<typeof saveSectionsSchema>) {
  const parsed = saveSectionsSchema.safeParse(input);
  if (!parsed.success) return { error: "Data section tidak valid." };

  const { supabase, user, invitation } = await requireOwner(parsed.data.invitationId);
  if (!user || !invitation) return { error: "Undangan tidak ditemukan." };

  const seen = new Set<string>();
  for (const section of parsed.data.sections) {
    if (seen.has(section.id)) return { error: "Section duplikat." };
    seen.add(section.id);

    const contentSchema = sectionContentSchemas[section.section_type];
    if (!contentSchema.safeParse(section.content).success) {
      return { error: `Konten section "${section.section_key}" tidak valid.` };
    }
  }

  const { data: existing, error: existingError } = await supabase
    .from("invitation_sections")
    .select("id, invitation_id")
    .eq("invitation_id", parsed.data.invitationId);

  if (existingError) return { error: "Gagal memuat struktur section." };

  const existingIds = new Set((existing ?? []).map((row) => row.id));
  if (parsed.data.sections.some((section) => !existingIds.has(section.id))) {
    return { error: "Section tidak dikenali untuk undangan ini." };
  }

  for (const section of parsed.data.sections) {
    const { error } = await supabase
      .from("invitation_sections")
      .update({
        section_key: section.section_key,
        position: section.position,
        content: section.content,
        is_visible: section.is_visible,
      })
      .eq("id", section.id)
      .eq("invitation_id", parsed.data.invitationId);

    if (error) {
      console.error("saveInvitationSections failed", error);
      return { error: "Perubahan section gagal disimpan." };
    }
  }

  revalidatePath(`/dashboard/invitations/${parsed.data.invitationId}`);
  revalidatePath(`/dashboard/invitations/${parsed.data.invitationId}/builder`);
  revalidatePath(`/undangan/${(await supabase.from("invitations").select("slug").eq("id", parsed.data.invitationId).single()).data?.slug ?? ""}`);

  return { success: true, savedAt: new Date().toISOString() };
}
