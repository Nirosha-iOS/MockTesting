import { describe, expect, it } from "vitest";
import { accentPresets } from "./tokens";
import { createTheme, themeToCssVariables } from "./theme";

describe("createTheme", () => {
  it("returns light palette by default", () => {
    const t = createTheme("light");
    expect(t.colors.background).toMatch(/F8FAFC/i);
    expect(t.mode).toBe("light");
    expect(t.accent).toBe("navy");
    expect(t.fontScale).toBe("standard");
  });

  it("returns dark palette when requested", () => {
    const t = createTheme("dark");
    expect(t.colors.background.toLowerCase()).toContain("0f172a");
    expect(t.mode).toBe("dark");
  });

  it("applies accent preset colors", () => {
    const t = createTheme("light", "violet");
    expect(t.colors.primary).toBe(accentPresets.violet.primary);
    expect(t.colors.secondary).toBe(accentPresets.violet.secondary);
  });

  it("uses darker shadows in dark mode", () => {
    const light = createTheme("light");
    const dark = createTheme("dark");
    expect(light.shadows.card).not.toBe(dark.shadows.card);
  });
});

describe("themeToCssVariables", () => {
  it("maps primary color to CSS variable", () => {
    const vars = themeToCssVariables(createTheme("light"));
    expect(vars["--color-primary"]).toBeTruthy();
    expect(vars["--space-md"]).toContain("12");
  });

  it("exposes four text and four label steps", () => {
    const vars = themeToCssVariables(createTheme("light"));
    expect(vars["--app-text-1-size"]).toBe("12px");
    expect(vars["--app-text-4-size"]).toBe("22px");
    expect(vars["--app-label-1-size"]).toBe("10px");
    expect(vars["--font-weight-semibold"]).toBe("600");
  });

  it("scales text sizes when fontScale is compact", () => {
    const standard = themeToCssVariables(createTheme("light", "navy", "standard"));
    const compact = themeToCssVariables(createTheme("light", "navy", "compact"));
    expect(parseInt(compact["--app-text-4-size"]!, 10)).toBeLessThan(parseInt(standard["--app-text-4-size"]!, 10));
  });
});
