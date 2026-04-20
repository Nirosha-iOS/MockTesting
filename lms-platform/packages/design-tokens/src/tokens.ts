/**
 * Single source of truth for visual design.
 * Admin web and mobile map these tokens to CSS variables / StyleSheet.
 */
export const colorTokens = {
  primary: "#1E3A5F",
  primaryDark: "#152A45",
  secondary: "#3B82F6",
  accent: "#F59E0B",
  success: "#16A34A",
  warning: "#D97706",
  error: "#DC2626",
  info: "#0284C7",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  disabled: "#94A3B8",
  placeholder: "#94A3B8",
} as const;

export const colorTokensDark = {
  ...colorTokens,
  textPrimary: "#F1F5F9",
  textSecondary: "#CBD5E1",
  background: "#0F172A",
  surface: "#1E293B",
  border: "#334155",
} as const;

export const spacingTokens = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radiusTokens = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const typographyTokens = {
  fontFamilyPrimary: "Inter, system-ui, sans-serif",
  fontFamilySecondary: "Georgia, serif",
  fontWeightRegular: "400",
  fontWeightMedium: "500",
  fontWeightSemibold: "600",
  fontWeightBold: "700",
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 22,
  labelSizeSm: 11,
  labelSizeMd: 12,
  labelSizeLg: 13,
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
} as const;

/** Four body / UI text levels — use these sizes only (mapped to legacy --font-size-* in theme). */
export const appTextScale = {
  1: { sizePx: 12, lineHeight: 1.45, weight: 400 },
  2: { sizePx: 14, lineHeight: 1.5, weight: 400 },
  3: { sizePx: 16, lineHeight: 1.35, weight: 600 },
  4: { sizePx: 22, lineHeight: 1.25, weight: 700 },
} as const;

/** Four label levels (forms, tags, column headers). */
export const appLabelScale = {
  1: { sizePx: 10, weight: 600, letterSpacing: "0.06em" },
  2: { sizePx: 11, weight: 600, letterSpacing: "0.02em" },
  3: { sizePx: 12, weight: 600, letterSpacing: "0.01em" },
  4: { sizePx: 14, weight: 600, letterSpacing: "0" },
} as const;

/** Five brand accents (primary / primaryDark / secondary). */
export const accentPresets = {
  navy: { primary: "#1E3A5F", primaryDark: "#152A45", secondary: "#3B82F6" },
  ocean: { primary: "#0E7490", primaryDark: "#155E75", secondary: "#06B6D4" },
  violet: { primary: "#5B21B6", primaryDark: "#4C1D95", secondary: "#8B5CF6" },
  emerald: { primary: "#065F46", primaryDark: "#064E3B", secondary: "#10B981" },
  amber: { primary: "#B45309", primaryDark: "#92400E", secondary: "#F59E0B" },
} as const;

export type AccentId = keyof typeof accentPresets;

/** Multiplier for all text and label step sizes (Settings → Typography). */
export const fontScaleSteps = {
  compact: 0.9,
  standard: 1,
  comfortable: 1.12,
} as const;

export type FontScaleId = keyof typeof fontScaleSteps;

export const componentTokens = {
  inputHeightSm: 32,
  inputHeightMd: 40,
  inputHeightLg: 48,
  buttonHeightSm: 32,
  buttonHeightMd: 40,
  buttonHeightLg: 48,
  chipHeight: 28,
  cardRadius: radiusTokens.md,
  modalRadius: radiusTokens.lg,
  tableRowHeight: 44,
  appBarHeight: 56,
  sidebarWidth: 260,
} as const;

export const shadowTokens = {
  card: "0 1px 3px rgba(15, 23, 42, 0.12)",
  modal: "0 10px 40px rgba(15, 23, 42, 0.18)",
} as const;

export const shadowTokensDark = {
  card: "0 1px 3px rgba(0, 0, 0, 0.35)",
  modal: "0 10px 40px rgba(0, 0, 0, 0.5)",
} as const;

export const breakpointTokens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const iconSizeTokens = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export type ColorTokenKey = keyof typeof colorTokens;
export type SpacingTokenKey = keyof typeof spacingTokens;
