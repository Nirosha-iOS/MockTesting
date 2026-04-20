import { afterEach, describe, expect, it, vi } from "vitest";
import { loginRequest } from "./authApi";

describe("authApi", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loginRequest returns auth payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            success: true,
            data: {
              accessToken: "t1",
              expiresInSeconds: 3600,
              user: { email: "a@b.com", displayName: "A", role: "LMS_ADMIN" },
            },
          }),
      }),
    );

    const res = await loginRequest("a@b.com", "pw");
    expect(res.accessToken).toBe("t1");
    expect(res.user.email).toBe("a@b.com");
  });
});
