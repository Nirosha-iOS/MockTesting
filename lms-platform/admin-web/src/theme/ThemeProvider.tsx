import { createTheme, themeToCssVariables, type AccentId, type FontScaleId, type ThemeMode } from "@lms/design-tokens";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultThemeState, readPersistedTheme, writePersistedTheme } from "./themeStorage";

export interface AppThemeContextValue {
  mode: ThemeMode;
  accent: AccentId;
  fontScale: FontScaleId;
  setMode: (m: ThemeMode) => void;
  setAccent: (a: AccentId) => void;
  setFontScale: (s: FontScaleId) => void;
}

const ThemeContext = createContext<AppThemeContextValue | undefined>(undefined);

function loadInitial() {
  const saved = readPersistedTheme();
  return saved ? { mode: saved.mode, accent: saved.accent, fontScale: saved.fontScale } : defaultThemeState();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(loadInitial);

  const setMode = useCallback((m: ThemeMode) => {
    setTheme((s) => ({ ...s, mode: m }));
  }, []);

  const setAccent = useCallback((a: AccentId) => {
    setTheme((s) => ({ ...s, accent: a }));
  }, []);

  const setFontScale = useCallback((fontScale: FontScaleId) => {
    setTheme((s) => ({ ...s, fontScale }));
  }, []);

  const value = useMemo(
    () => ({
      mode: theme.mode,
      accent: theme.accent,
      fontScale: theme.fontScale,
      setMode,
      setAccent,
      setFontScale,
    }),
    [theme.mode, theme.accent, theme.fontScale, setMode, setAccent, setFontScale],
  );

  useEffect(() => {
    writePersistedTheme({ mode: theme.mode, accent: theme.accent, fontScale: theme.fontScale });
  }, [theme.mode, theme.accent, theme.fontScale]);

  useEffect(() => {
    const t = createTheme(theme.mode, theme.accent, theme.fontScale);
    const vars = themeToCssVariables(t);
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.dataset.theme = theme.mode;
    root.dataset.accent = theme.accent;
    root.dataset.fontScale = theme.fontScale;
    root.style.colorScheme = theme.mode;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t.colors.primary);
  }, [theme.mode, theme.accent, theme.fontScale]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return ctx;
}

/** @deprecated Use useAppTheme — kept for a smaller diff in call sites. */
export function useThemeMode() {
  const { mode, setMode } = useAppTheme();
  return { mode, setMode };
}
