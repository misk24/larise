import { describe, expect, it } from "vitest";
import {
  emailSchema,
  loginSchema,
  passwordResetSchema,
  registerSchema,
  safeRedirectPath,
} from "@/lib/auth/validation";

describe("auth validation", () => {
  it("normalizes accepted redirect paths without allowing external URLs", () => {
    expect(safeRedirectPath("/dashboard/settings")).toBe("/dashboard/settings");
    expect(safeRedirectPath("/dashboard?tab=profile")).toBe("/dashboard?tab=profile");
    expect(safeRedirectPath("https://evil.example")).toBe("/dashboard");
    expect(safeRedirectPath("//evil.example/path")).toBe("/dashboard");
  });

  it("validates email and password requirements", () => {
    expect(emailSchema.safeParse("mail@example.com").success).toBe(true);
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
    expect(loginSchema.safeParse({ email: "mail@example.com", password: "12345678" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "mail@example.com", password: "short" }).success).toBe(false);
  });

  it("requires matching registration passwords", () => {
    expect(registerSchema.safeParse({
      email: "mail@example.com",
      password: "12345678",
      confirmPassword: "12345678",
    }).success).toBe(true);

    expect(registerSchema.safeParse({
      email: "mail@example.com",
      password: "12345678",
      confirmPassword: "87654321",
    }).success).toBe(false);
  });

  it("requires matching reset passwords", () => {
    expect(passwordResetSchema.safeParse({
      password: "12345678",
      confirmPassword: "12345678",
    }).success).toBe(true);
  });
});
