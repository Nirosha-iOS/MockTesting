import { createTheme, type LmsTheme } from "./theme";
import type { AccentId, FontScaleId } from "./tokens";

export type NativeTheme = LmsTheme;

/** React Native: map tokens to style buckets used by the app shell. */
export function createNativeTheme(mode: "light" | "dark" = "light", accent: AccentId = "navy", fontScale: FontScaleId = "standard"): NativeTheme {
  return createTheme(mode, accent, fontScale);
}

export function nativePaperTheme(theme: NativeTheme) {
  const { colors, spacing, radius, typography } = theme;
  return {
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      info: colors.info,
      text: colors.textPrimary,
      textSecondary: colors.textSecondary,
      background: colors.background,
      surface: colors.surface,
      border: colors.border,
    },
    spacing,
    radius,
    typography,
  };
}

export function textPrimaryStyle(theme: NativeTheme) {
  return {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeMd,
    fontFamily: theme.typography.fontFamilyPrimary,
  } as const;
}

export function surfaceStyle(theme: NativeTheme) {
  return {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  } as const;
}
