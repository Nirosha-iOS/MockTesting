import { describe, expect, it, vi } from "vitest";
import { httpJson } from "./httpClient";

describe("httpJson", () => {
  it("parses JSON body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ hello: "world" }),
      }),
    );

    const body = await httpJson<{ hello: string }>("/x");
    expect(body.hello).toBe("world");
  });

  it("throws on non-ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "",
      }),
    );

    await expect(httpJson("/bad")).rejects.toThrow("HTTP 500");
  });

  it("clears session on 401", async () => {
    const removeSpy = vi.spyOn(Storage.prototype, "removeItem");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ success: false }),
      }),
    );

    await expect(httpJson("/secure")).rejects.toThrow("HTTP 401");
    expect(removeSpy).toHaveBeenCalled();
  });
});
