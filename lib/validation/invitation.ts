import { z } from "zod";
import slugify from "slugify";

export const invitationNameOrderSchema = z.enum(["groom_first", "bride_first"]);

const invitationDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal acara tidak valid.");

export const invitationInputSchema = z.object({
  themeId: z.string().uuid(),
  groomName: z.string().trim().min(1).max(120),
  groomNickname: z.string().trim().min(1).max(60),
  brideName: z.string().trim().min(1).max(120),
  brideNickname: z.string().trim().min(1).max(60),
  nameOrder: invitationNameOrderSchema,
  eventDate: invitationDateSchema,
});

export const invitationSettingsSchema = z.object({
  themeId: z.string().uuid(),
  groomName: z.string().trim().min(1).max(120),
  groomNickname: z.string().trim().min(1).max(60),
  brideName: z.string().trim().min(1).max(120),
  brideNickname: z.string().trim().min(1).max(60),
  eventDate: invitationDateSchema,
});

export function normalizeSlug(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
    locale: "id",
  }).slice(0, 80);
}

export function buildInvitationSlug(firstNickname: string, secondNickname: string) {
  return normalizeSlug(`${firstNickname}-${secondNickname}`) || "undangan";
}
