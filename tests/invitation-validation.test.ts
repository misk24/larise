import { describe, expect, it } from "vitest";
import {
  buildInvitationSlug,
  invitationInputSchema,
  invitationNameOrderSchema,
  invitationSettingsSchema,
} from "@/lib/validation/invitation";

const validInput = {
  themeId: "7e5f5e92-8a7b-4f72-aee1-5b7c1a9e3f20",
  groomName: "Muhammad Rizky Pratama",
  groomNickname: "Rizky",
  brideName: "Putri Ayu Lestari",
  brideNickname: "Putri",
  nameOrder: "groom_first" as const,
};

describe("invitation creation validation", () => {
  it("generates a slug from nicknames in the selected order", () => {
    expect(buildInvitationSlug("Rizky", "Putri")).toBe("rizky-putri");
    expect(buildInvitationSlug("Putri", "Rizky")).toBe("putri-rizky");
  });

  it("does not generate a slug before both nicknames are provided", () => {
    expect(buildInvitationSlug("", "Putri")).toBe("");
    expect(buildInvitationSlug("Rizky", "")).toBe("");
  });

  it("accepts valid invitation identity without event details", () => {
    expect(invitationInputSchema.safeParse(validInput).success).toBe(true);
    expect(invitationNameOrderSchema.safeParse("bride_first").success).toBe(true);
  });

  it("rejects invalid order and missing nicknames", () => {
    expect(invitationInputSchema.safeParse({ ...validInput, nameOrder: "random" }).success).toBe(false);
    expect(invitationInputSchema.safeParse({ ...validInput, groomNickname: " " }).success).toBe(false);
  });

  it("does not accept slug or name order in settings updates", () => {
    const parsed = invitationSettingsSchema.safeParse({ ...validInput, nameOrder: "bride_first", slug: "another-slug" });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).not.toHaveProperty("nameOrder");
      expect(parsed.data).not.toHaveProperty("slug");
    }
    expect(invitationSettingsSchema.safeParse({
      themeId: validInput.themeId,
      groomName: validInput.groomName,
      groomNickname: validInput.groomNickname,
      brideName: validInput.brideName,
      brideNickname: validInput.brideNickname,
    }).success).toBe(true);
  });
});
