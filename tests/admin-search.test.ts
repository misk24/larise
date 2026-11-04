import { describe, expect, it } from "vitest";
import { normalizeAdminSearchTerm, postgrestIlikePattern, sanitizeAdminSearch } from "@/lib/utils/admin-search";

describe("admin search normalization", () => {
  it("strips PostgREST filter grammar and wildcard characters", () => {
    expect(sanitizeAdminSearch("  ayu,(.*)  ")).toBe("ayu");
  });

  it("preserves email and order identifier punctuation safely in quoted ILIKE patterns", () => {
    const email = sanitizeAdminSearch("mail@example.com");
    const order = sanitizeAdminSearch("INV-2026.001");

    expect(email).toBe("mail@example.com");
    expect(postgrestIlikePattern(email)).toBe('"%mail@example.com%"');
    expect(postgrestIlikePattern(order)).toBe('"%INV-2026.001%"');
    expect(sanitizeAdminSearch('x"),status.eq.paid,("')).toBe("x status eq paid");
  });

  it("keeps Unicode letters and normalizes separators for joined-field search", () => {
    expect(normalizeAdminSearchTerm("Mail.Example+tag@domain.com")).toBe("mailexampletagdomaincom");
    expect(normalizeAdminSearchTerm("Ayu Putri")).toBe("ayuputri");
    expect(normalizeAdminSearchTerm("Dewi-Sari")).toBe("dewisari");
  });
});
