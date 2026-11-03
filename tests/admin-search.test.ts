import { describe, expect, it } from "vitest";
import { normalizeAdminSearchTerm, sanitizeAdminSearch } from "@/lib/utils/admin-search";

describe("admin search normalization", () => {
  it("strips PostgREST filter grammar and wildcard characters", () => {
    expect(sanitizeAdminSearch("  ayu,(.*)  ")).toBe("ayu");
  });

  it("keeps Unicode letters and normalizes separators for joined-field search", () => {
    expect(normalizeAdminSearchTerm("Mail.Example+tag@domain.com")).toBe("mailexampletagdomaincom");
    expect(normalizeAdminSearchTerm("Ayu Putri")).toBe("ayuputri");
    expect(normalizeAdminSearchTerm("Dewi-Sari")).toBe("dewisari");
  });
});
