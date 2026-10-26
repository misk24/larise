import { z } from "zod";
import slugify from "slugify";

export const invitationNameOrderSchema = z.enum(["groom_first", "bride_first"]);

export const invitationInputSchema = z.object({
  themeId: z.string().uuid(),
  groomName: z.string().trim().min(1).max(120),
  groomNickname: z.string().trim().min(1).max(60),
  brideName: z.string().trim().min(1).max(120),
  brideNickname: z.string().trim().min(1).max(60),
  nameOrder: invitationNameOrderSchema,
});

export const invitationSettingsSchema = z.object({
  themeId: z.string().uuid(),
  groomName: z.string().trim().min(1).max(120),
  groomNickname: z.string().trim().min(1).max(60),
  brideName: z.string().trim().min(1).max(120),
  brideNickname: z.string().trim().min(1).max(60),
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
  if (!firstNickname.trim() || !secondNickname.trim()) return "";
  return normalizeSlug(`${firstNickname}-${secondNickname}`);
}


/**
 * Background music must be an HTTPS audio URL supplied by the invitation owner.
 * The app never fetches this URL server-side, so it cannot be used for server-side requests.
 */
export const backgroundMusicUrlSchema = z.string().trim().max(2048).refine((value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && !url.username
      && !url.password
      && url.hostname.includes(".")
      && url.hostname !== "localhost"
      && !url.hostname.endsWith(".localhost")
      && !url.hostname.endsWith(".local");
  } catch {
    return false;
  }
}, "Gunakan URL audio HTTPS yang valid.");
