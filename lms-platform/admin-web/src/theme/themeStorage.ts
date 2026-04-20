import { accentPresets, fontScaleSteps, type AccentId, type FontScaleId } from "@lms/design-tokens";
import type { ThemeMode } from "@lms/design-tokens";

export const THEME_STORAGE_KEY = "lms-admin-theme";

export type PersistedThemeV1 = {
  v: 1;
  mode: ThemeMode;
  accent: AccentId;
  fontScale: FontScaleId;
};

function isAccentId(x: string): x is AccentId {
  return x in accentPresets;
}

function isFontScaleId(x: string): x is FontScaleId {
  return x in fontScaleSteps;
}

export function readPersistedTheme(): PersistedThemeV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<PersistedThemeV1> & { mode?: string; accent?: string; fontScale?: string };
    if (p.mode !== "light" && p.mode !== "dark") return null;
    const accent = typeof p.accent === "string" && isAccentId(p.accent) ? p.accent : "navy";
    const fontScale = typeof p.fontScale === "string" && isFontScaleId(p.fontScale) ? p.fontScale : "standard";
    return { v: 1, mode: p.mode, accent, fontScale };
  } catch {
    return null;
  }
}

export function writePersistedTheme(state: Omit<PersistedThemeV1, "v">): void {
  if (typeof window === "undefined") return;
  try {
    const payload: PersistedThemeV1 = { v: 1, mode: state.mode, accent: state.accent, fontScale: state.fontScale };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota / private mode */
  }
}

export function defaultThemeState(): Omit<PersistedThemeV1, "v"> {
  return { mode: "light", accent: "navy", fontScale: "standard" };
}
