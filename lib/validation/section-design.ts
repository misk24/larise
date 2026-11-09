import { z } from "zod";

const color = z.string().trim().max(64).regex(
  /^(#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\)|[a-z]{1,24})$/i,
  "Format warna tidak valid.",
);
const fontFamily = z.string().trim().min(1).max(100).regex(/^[\w ,"'()-]+$/, "Font family tidak valid.");
const bounded = (min: number, max: number) => z.number().finite().min(min).max(max);

const backgroundSchema = z.object({
  type: z.enum(["color", "image", "gradient"]).optional(),
  value: z.string().max(2048).optional(),
  position: z.string().regex(/^(center|top|bottom|left|right|\d{1,3}%\s+\d{1,3}%)$/).optional(),
  size: z.enum(["cover", "contain", "auto"]).optional(),
  overlay: bounded(0, 1).optional(),
}).strict().superRefine((value, ctx) => {
  if (value.type === "color" && value.value && !color.safeParse(value.value).success) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["value"], message: "Warna background tidak valid." });
  }
  if (value.type === "image" && value.value) {
    try {
      const url = new URL(value.value, "https://larise.invalid");
      if (!["http:", "https:"].includes(url.protocol) || value.value.startsWith("//") || /[\u0000-\u0020"'()\\]/.test(value.value)) throw new Error();
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["value"], message: "URL background harus berupa URL HTTP(S) atau path lokal yang aman." });
    }
  }
  if (value.type === "gradient" && value.value && !/^linear-gradient\(\s*(?:\d{1,3}deg\s*,\s*)?(?:#[\da-f]{3,8}|[a-z]{1,24}|rgba?\([\d\s.,%]+\))\s*,\s*(?:#[\da-f]{3,8}|[a-z]{1,24}|rgba?\([\d\s.,%]+\))(?:\s*,\s*(?:#[\da-f]{3,8}|[a-z]{1,24}|rgba?\([\d\s.,%]+\)))*\s*\)$/i.test(value.value)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["value"], message: "Format gradient tidak valid." });
  }
});

export const sectionDesignSchema = z.object({
  background: backgroundSchema.optional(),
  typography: z.object({
    fontFamily: fontFamily.optional(), headingFontFamily: fontFamily.optional(), bodyFontFamily: fontFamily.optional(),
    headingFontSize: bounded(12, 120).optional(), bodyFontSize: bounded(8, 48).optional(),
    headingColor: color.optional(), bodyColor: color.optional(), color: color.optional(),
    headingFontWeight: bounded(100, 900).optional(), bodyFontWeight: bounded(100, 900).optional(), fontWeight: bounded(100, 900).optional(),
    headingAlignment: z.enum(["left", "center", "right"]).optional(), bodyAlignment: z.enum(["left", "center", "right"]).optional(),
    alignment: z.enum(["left", "center", "right"]).optional(), lineHeight: bounded(0.8, 3).optional(), letterSpacing: bounded(-5, 20).optional(),
  }).strict().optional(),
  layout: z.object({ paddingTop: bounded(0, 400).optional(), paddingBottom: bounded(0, 400).optional(), elementGap: bounded(0, 96).optional() }).strict().optional(),
  button: z.object({
    backgroundColor: color.optional(), textColor: color.optional(), borderColor: color.optional(),
    borderRadius: bounded(0, 48).optional(), fontSize: bounded(10, 32).optional(),
    paddingX: bounded(0, 64).optional(), paddingY: bounded(0, 40).optional(),
  }).strict().optional(),
  image: z.object({
    borderRadius: bounded(0, 48).optional(), aspectRatio: z.enum(["square", "portrait", "landscape"]).optional(),
    objectFit: z.enum(["cover", "contain"]).optional(), objectPosition: z.enum(["center", "top", "bottom", "left", "right"]).or(z.string().regex(/^\d{1,3}%\s+\d{1,3}%$/)).optional(),
  }).strict().optional(),
  icon: z.object({ color: color.optional(), size: bounded(12, 96).optional(), strokeWidth: bounded(1, 4).optional() }).strict().optional(),
  divider: z.object({
    color: color.optional(), thickness: bounded(1, 8).optional(), width: bounded(10, 100).optional(),
    style: z.enum(["solid", "dashed", "dotted"]).optional(), spacing: bounded(0, 160).optional(),
  }).strict().optional(),
  ornament: z.object({
    color: color.optional(), size: bounded(8, 160).optional(), opacity: bounded(0, 1).optional(),
    position: z.enum(["top-left", "top-right", "bottom-left", "bottom-right"]).optional(),
  }).strict().optional(),
}).strict();

export function validateSectionDesign(content: Record<string, unknown>) {
  if (!Object.prototype.hasOwnProperty.call(content, "design")) return { success: true as const };
  return sectionDesignSchema.safeParse(content.design);
}
