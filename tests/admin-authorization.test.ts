import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  createAdminClient: vi.fn(),
  getUser: vi.fn(),
  maybeSingle: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: mocks.createAdminClient,
}));

import { getAdminApiContext } from "@/lib/admin/authorization";

describe("admin API authorization", () => {
  const sessionClient = { auth: { getUser: mocks.getUser } };
  const adminClient = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: mocks.maybeSingle,
        })),
      })),
    })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createClient.mockResolvedValue(sessionClient);
    mocks.createAdminClient.mockReturnValue(adminClient);
    mocks.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });
    mocks.maybeSingle.mockResolvedValue({
      data: { role: "admin" },
      error: null,
    });
  });

  it("rejects unauthenticated requests before creating a privileged client", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "No session" },
    });

    const result = await getAdminApiContext();

    expect(result.response?.status).toBe(401);
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("rejects ordinary users even when their session contains user metadata claiming admin", async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: "user-123",
          app_metadata: { role: "admin" },
          user_metadata: { role: "admin" },
        },
      },
      error: null,
    });
    mocks.maybeSingle.mockResolvedValue({
      data: { role: "user" },
      error: null,
    });

    const result = await getAdminApiContext();

    expect(result.response?.status).toBe(403);
    expect(result.supabase).toBe(sessionClient);
  });

  it("fails closed when the server-controlled profile role cannot be verified", async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: null,
      error: { message: "Database unavailable" },
    });

    const result = await getAdminApiContext();

    expect(result.response?.status).toBe(500);
    expect(result.supabase).toBe(sessionClient);
  });

  it("allows a verified admin and returns the privileged client", async () => {
    const result = await getAdminApiContext();

    expect(result.response).toBeNull();
    expect(result.supabase).toBe(adminClient);
    expect(adminClient.from).toHaveBeenCalledWith("profiles");
  });
});
