import { afterEach, describe, expect, it, vi } from "vitest";
import { createLead, fetchLeads } from "./leadsApi";

describe("leadsApi", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchLeads returns data on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            success: true,
            data: [
              {
                id: 1,
                leadId: "LD1",
                fullName: "A",
                email: "a@b.com",
                mobile: "",
                companyName: null,
                leadSource: null,
                productInterested: null,
                budget: null,
                description: null,
                country: null,
                state: null,
                city: null,
                pincode: null,
                status: "NEW",
                stage: "NEW",
                priority: null,
                assignedTo: null,
                expectedCloseDate: null,
                campaignId: null,
                createdDate: "t",
                updatedDate: "t",
                createdBy: "SYSTEM",
              },
            ],
          }),
      }),
    );

    const rows = await fetchLeads();
    expect(rows).toHaveLength(1);
    expect(rows[0].fullName).toBe("A");
  });

  it("createLead posts payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        text: async () =>
          JSON.stringify({
            success: true,
            data: {
              id: 2,
              leadId: "LD2",
              fullName: "B",
              email: "b@c.com",
              mobile: "1",
              companyName: null,
              leadSource: null,
              productInterested: null,
              budget: null,
              description: null,
              country: null,
              state: null,
              city: null,
              pincode: null,
              status: "NEW",
              stage: "NEW",
              priority: null,
              assignedTo: null,
              expectedCloseDate: null,
              campaignId: null,
              createdDate: "t",
              updatedDate: "t",
              createdBy: "SYSTEM",
            },
          }),
      }),
    );

    const created = await createLead({ fullName: "B", email: "b@c.com", phone: "1", stage: "NEW" });
    expect(created.id).toBe(2);
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/leads",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ fullName: "B", email: "b@c.com", phone: "1", stage: "NEW" }),
      }),
    );
  });
});
