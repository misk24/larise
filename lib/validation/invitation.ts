import { z } from "zod";
import slugify from "slugify";

export const invitationInputSchema = z.object({
  themeId: z.string().uuid(),
  groomName: z.string().trim().min(1).max(120),
  brideName: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(3).max(80).optional(),
});

export const invitationSettingsSchema = z.object({
  themeId: z.string().uuid(),
  groomName: z.string().trim().min(1).max(120),
  brideName: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(3).max(80),
});

export function normalizeSlug(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
    locale: "id",
  }).slice(0, 80);
}

export function buildInvitationSlug(groomName: string, brideName: string) {
  return normalizeSlug(`${groomName}-${brideName}`) || `undangan-${Date.now()}`;
}
