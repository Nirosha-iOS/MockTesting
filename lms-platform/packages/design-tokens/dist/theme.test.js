"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const tokens_1 = require("./tokens");
const theme_1 = require("./theme");
(0, vitest_1.describe)("createTheme", () => {
    (0, vitest_1.it)("returns light palette by default", () => {
        const t = (0, theme_1.createTheme)("light");
        (0, vitest_1.expect)(t.colors.background).toMatch(/F8FAFC/i);
        (0, vitest_1.expect)(t.mode).toBe("light");
        (0, vitest_1.expect)(t.accent).toBe("navy");
        (0, vitest_1.expect)(t.fontScale).toBe("standard");
    });
    (0, vitest_1.it)("returns dark palette when requested", () => {
        const t = (0, theme_1.createTheme)("dark");
        (0, vitest_1.expect)(t.colors.background.toLowerCase()).toContain("0f172a");
        (0, vitest_1.expect)(t.mode).toBe("dark");
    });
    (0, vitest_1.it)("applies accent preset colors", () => {
        const t = (0, theme_1.createTheme)("light", "violet");
        (0, vitest_1.expect)(t.colors.primary).toBe(tokens_1.accentPresets.violet.primary);
        (0, vitest_1.expect)(t.colors.secondary).toBe(tokens_1.accentPresets.violet.secondary);
    });
    (0, vitest_1.it)("uses darker shadows in dark mode", () => {
        const light = (0, theme_1.createTheme)("light");
        const dark = (0, theme_1.createTheme)("dark");
        (0, vitest_1.expect)(light.shadows.card).not.toBe(dark.shadows.card);
    });
});
(0, vitest_1.describe)("themeToCssVariables", () => {
    (0, vitest_1.it)("maps primary color to CSS variable", () => {
        const vars = (0, theme_1.themeToCssVariables)((0, theme_1.createTheme)("light"));
        (0, vitest_1.expect)(vars["--color-primary"]).toBeTruthy();
        (0, vitest_1.expect)(vars["--space-md"]).toContain("12");
    });
    (0, vitest_1.it)("exposes four text and four label steps", () => {
        const vars = (0, theme_1.themeToCssVariables)((0, theme_1.createTheme)("light"));
        (0, vitest_1.expect)(vars["--app-text-1-size"]).toBe("12px");
        (0, vitest_1.expect)(vars["--app-text-4-size"]).toBe("22px");
        (0, vitest_1.expect)(vars["--app-label-1-size"]).toBe("10px");
        (0, vitest_1.expect)(vars["--font-weight-semibold"]).toBe("600");
    });
    (0, vitest_1.it)("scales text sizes when fontScale is compact", () => {
        const standard = (0, theme_1.themeToCssVariables)((0, theme_1.createTheme)("light", "navy", "standard"));
        const compact = (0, theme_1.themeToCssVariables)((0, theme_1.createTheme)("light", "navy", "compact"));
        (0, vitest_1.expect)(parseInt(compact["--app-text-4-size"], 10)).toBeLessThan(parseInt(standard["--app-text-4-size"], 10));
    });
});
