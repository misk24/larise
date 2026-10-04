import { z } from "zod";

export const emailSchema = z.string().trim().email("Email tidak valid.");

export const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter.");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password tidak sama.",
    path: ["confirmPassword"],
  });

export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password tidak sama.",
    path: ["confirmPassword"],
  });

/**
 * Only allow same-origin relative paths for post-auth redirects.
 * Absolute URLs and protocol-relative URLs are rejected to prevent open redirects.
 */
export function safeRedirectPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(value, "http://larise.local");
    if (url.origin !== "http://larise.local") {
      return fallback;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
