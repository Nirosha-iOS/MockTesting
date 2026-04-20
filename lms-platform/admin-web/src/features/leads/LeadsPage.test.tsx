import { render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LeadFormRulesProvider } from "../configuration/LeadFormRulesContext";
import { routerFuture } from "../../routerFuture";
import { ACCESS_TOKEN_KEY } from "../../session/storageKeys";
import { LeadsPage } from "./LeadsPage";

function renderLeadsRoute(ui: ReactElement) {
  return render(
    <MemoryRouter future={routerFuture} initialEntries={["/leads"]}>
      <LeadFormRulesProvider>
        <Routes>
          <Route path="/leads" element={ui} />
        </Routes>
      </LeadFormRulesProvider>
    </MemoryRouter>,
  );
}

describe("LeadsPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem(ACCESS_TOKEN_KEY, "unit-test-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders leads returned by API", async () => {
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
                id: 9,
                leadId: "LD9",
                fullName: "Pat",
                email: "p@x.com",
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
                createdDate: "2024-01-01T00:00:00Z",
                updatedDate: "2024-01-01T00:00:00Z",
                createdBy: "SYSTEM",
              },
            ],
          }),
      }),
    );

    renderLeadsRoute(<LeadsPage />);

    await waitFor(() => expect(screen.getByText("Pat")).toBeInTheDocument());
  });

  it("opens create drawer", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true, data: [] }),
      }),
    );

    renderLeadsRoute(<LeadsPage />);

    const createButtons = screen.getAllByRole("button", { name: /create new lead/i });
    await user.click(createButtons[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
