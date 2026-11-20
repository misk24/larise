import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { THEME_CATEGORIES, themeCategoryLabel } from "@/lib/theme-categories";

describe("theme categories", () => {
  it("matches the category enum the admin theme API accepts", () => {
    const route = readFileSync("app/api/admin/themes/[id]/route.ts", "utf8");
    const match = route.match(/category:\s*z\.enum\(\[([^\]]+)\]\)/);
    expect(match).not.toBeNull();
    const accepted = match![1].split(",").map((item) => item.trim().replace(/"/g, ""));
    expect(THEME_CATEGORIES.map((item) => item.value)).toEqual(accepted);
  });

  it("labels known categories and falls back for unknown or empty values", () => {
    expect(themeCategoryLabel("elegant")).toBe("Elegan");
    expect(themeCategoryLabel("legacy-style")).toBe("legacy-style");
    expect(themeCategoryLabel(null)).toBe("—");
  });
});
