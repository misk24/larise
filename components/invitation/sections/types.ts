import { z } from "zod";

export const sectionTypeSchema = z.enum([
  "cover","opening","couple","quote","event","countdown","gallery","location","closing","rsvp","wishes","gift",
]);
export type SectionType = z.infer<typeof sectionTypeSchema>;

const base = z.record(z.unknown());
export const sectionContentSchemas: Record<SectionType, z.ZodTypeAny> = {
  cover: base.extend({ eyebrow:z.string().optional(), title:z.string().optional(), subtitle:z.string().optional() }),
  opening: base.extend({ title:z.string().optional(), body:z.string().optional() }),
  couple: base.extend({ title:z.string().optional(), groom_name:z.string().optional(), bride_name:z.string().optional(), groom_parents:z.string().optional(), bride_parents:z.string().optional() }),
  quote: base.extend({ quote:z.string().optional(), author:z.string().optional() }),
  event: base.extend({ title:z.string().optional(), date:z.string().optional(), time:z.string().optional(), venue:z.string().optional(), address:z.string().optional() }),
  countdown: base.extend({ title:z.string().optional(), target_date:z.string().optional() }),
  gallery: base.extend({ title:z.string().optional(), images:z.array(z.string()).optional() }),
  location: base.extend({ title:z.string().optional(), venue:z.string().optional(), address:z.string().optional(), maps_url:z.string().url().optional() }),
  closing: base.extend({ title:z.string().optional(), body:z.string().optional() }),
  rsvp: base,
  wishes: base,
  gift: base.extend({ bank_name:z.string().optional(), account_number:z.string().optional(), account_name:z.string().optional() }),
};

export const invitationSectionSchema = z.object({
  id:z.string().uuid(),
  invitation_id:z.string().uuid(),
  section_key:z.string().min(1),
  section_type:sectionTypeSchema,
  position:z.number().int().nonnegative(),
  content:base,
  is_visible:z.boolean(),
});
export type InvitationSectionData = z.infer<typeof invitationSectionSchema>;
