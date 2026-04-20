import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider, useThemeMode } from "./ThemeProvider";

function Probe() {
  const { mode } = useThemeMode();
  return <span data-testid="mode">{mode}</span>;
}

describe("ThemeProvider", () => {
  it("applies CSS variables from design tokens", async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("mode").textContent).toBe("light");
    await waitFor(() => {
      const primary = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim();
      expect(primary.length).toBeGreaterThan(0);
    });
  });
});
