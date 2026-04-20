import {
  accentPresets,
  appLabelScale,
  appTextScale,
  breakpointTokens,
  colorTokens,
  colorTokensDark,
  componentTokens,
  fontScaleSteps,
  iconSizeTokens,
  radiusTokens,
  shadowTokens,
  shadowTokensDark,
  spacingTokens,
  typographyTokens,
  type AccentId,
  type FontScaleId,
} from "./tokens";

export type ThemeMode = "light" | "dark";

export type { AccentId };

/** Runtime palette (accent overrides primary family; all channels are string hex for TS simplicity). */
export type ThemeColorPalette = { [K in keyof typeof colorTokens]: string };

export interface LmsTheme {
  mode: ThemeMode;
  accent: AccentId;
  fontScale: FontScaleId;
  colors: ThemeColorPalette;
  spacing: typeof spacingTokens;
  radius: typeof radiusTokens;
  typography: typeof typographyTokens;
  components: typeof componentTokens;
  shadows: typeof shadowTokens | typeof shadowTokensDark;
  breakpoints: typeof breakpointTokens;
  iconSizes: typeof iconSizeTokens;
}

export function createTheme(mode: ThemeMode = "light", accent: AccentId = "navy", fontScale: FontScaleId = "standard"): LmsTheme {
  const base = mode === "dark" ? colorTokensDark : colorTokens;
  const preset = accentPresets[accent];
  const colors: ThemeColorPalette = {
    ...base,
    primary: preset.primary,
    primaryDark: preset.primaryDark,
    secondary: preset.secondary,
  };
  return {
    mode,
    accent,
    fontScale,
    colors,
    spacing: spacingTokens,
    radius: radiusTokens,
    typography: typographyTokens,
    components: componentTokens,
    shadows: mode === "dark" ? shadowTokensDark : shadowTokens,
    breakpoints: breakpointTokens,
    iconSizes: iconSizeTokens,
  };
}

/** Pixel sizes after font scale (for settings UI). */
export function getScaledTypographyPx(fontScale: FontScaleId) {
  const f = fontScaleSteps[fontScale];
  return {
    text: {
      1: Math.round(appTextScale[1].sizePx * f),
      2: Math.round(appTextScale[2].sizePx * f),
      3: Math.round(appTextScale[3].sizePx * f),
      4: Math.round(appTextScale[4].sizePx * f),
    },
    label: {
      1: Math.round(appLabelScale[1].sizePx * f),
      2: Math.round(appLabelScale[2].sizePx * f),
      3: Math.round(appLabelScale[3].sizePx * f),
      4: Math.round(appLabelScale[4].sizePx * f),
    },
  } as const;
}

/** Web: inject as CSS variables on :root */
export function themeToCssVariables(theme: LmsTheme): Record<string, string> {
  const { colors, spacing, radius, typography, components, shadows, fontScale } = theme;
  const scale = fontScaleSteps[fontScale];
  const vars: Record<string, string> = {
    "--color-primary": colors.primary,
    "--color-primary-dark": colors.primaryDark,
    "--color-secondary": colors.secondary,
    "--color-accent": colors.accent,
    "--color-success": colors.success,
    "--color-warning": colors.warning,
    "--color-error": colors.error,
    "--color-info": colors.info,
    "--color-text-primary": colors.textPrimary,
    "--color-text-secondary": colors.textSecondary,
    "--color-background": colors.background,
    "--color-surface": colors.surface,
    "--color-border": colors.border,
    "--color-disabled": colors.disabled,
    "--color-placeholder": colors.placeholder,
    "--font-family-primary": typography.fontFamilyPrimary,
    "--font-weight-regular": typography.fontWeightRegular,
    "--font-weight-medium": typography.fontWeightMedium,
    "--font-weight-semibold": typography.fontWeightSemibold,
    "--font-weight-bold": typography.fontWeightBold,
    "--line-height-normal": String(typography.lineHeightNormal),
    "--space-xxs": `${spacing.xxs}px`,
    "--space-xs": `${spacing.xs}px`,
    "--space-sm": `${spacing.sm}px`,
    "--space-md": `${spacing.md}px`,
    "--space-lg": `${spacing.lg}px`,
    "--space-xl": `${spacing.xl}px`,
    "--space-xxl": `${spacing.xxl}px`,
    "--radius-sm": `${radius.sm}px`,
    "--radius-md": `${radius.md}px`,
    "--radius-lg": `${radius.lg}px`,
    "--radius-xl": `${radius.xl}px`,
    "--input-height-md": `${components.inputHeightMd}px`,
    "--button-height-md": `${components.buttonHeightMd}px`,
    "--shadow-card": shadows.card,
    "--shadow-modal": shadows.modal,
  };

  ([1, 2, 3, 4] as const).forEach((n) => {
    const t = appTextScale[n];
    const sizePx = Math.round(t.sizePx * scale);
    vars[`--app-text-${n}-size`] = `${sizePx}px`;
    vars[`--app-text-${n}-lh`] = String(t.lineHeight);
    vars[`--app-text-${n}-weight`] = String(t.weight);
  });

  ([1, 2, 3, 4] as const).forEach((n) => {
    const l = appLabelScale[n];
    const sizePx = Math.round(l.sizePx * scale);
    vars[`--app-label-${n}-size`] = `${sizePx}px`;
    vars[`--app-label-${n}-weight`] = String(l.weight);
    vars[`--app-label-${n}-tracking`] = l.letterSpacing;
  });

  const t1 = Math.round(appTextScale[1].sizePx * scale);
  const t2 = Math.round(appTextScale[2].sizePx * scale);
  const t3 = Math.round(appTextScale[3].sizePx * scale);
  const t4 = Math.round(appTextScale[4].sizePx * scale);
  vars["--font-size-xs"] = `${t1}px`;
  vars["--font-size-sm"] = `${t2}px`;
  vars["--font-size-md"] = `${t3}px`;
  vars["--font-size-lg"] = `${t3}px`;
  vars["--font-size-xl"] = `${t4}px`;

  return vars;
}
