"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTheme = createTheme;
exports.getScaledTypographyPx = getScaledTypographyPx;
exports.themeToCssVariables = themeToCssVariables;
const tokens_1 = require("./tokens");
function createTheme(mode = "light", accent = "navy", fontScale = "standard") {
    const base = mode === "dark" ? tokens_1.colorTokensDark : tokens_1.colorTokens;
    const preset = tokens_1.accentPresets[accent];
    const colors = {
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
        spacing: tokens_1.spacingTokens,
        radius: tokens_1.radiusTokens,
        typography: tokens_1.typographyTokens,
        components: tokens_1.componentTokens,
        shadows: mode === "dark" ? tokens_1.shadowTokensDark : tokens_1.shadowTokens,
        breakpoints: tokens_1.breakpointTokens,
        iconSizes: tokens_1.iconSizeTokens,
    };
}
/** Pixel sizes after font scale (for settings UI). */
function getScaledTypographyPx(fontScale) {
    const f = tokens_1.fontScaleSteps[fontScale];
    return {
        text: {
            1: Math.round(tokens_1.appTextScale[1].sizePx * f),
            2: Math.round(tokens_1.appTextScale[2].sizePx * f),
            3: Math.round(tokens_1.appTextScale[3].sizePx * f),
            4: Math.round(tokens_1.appTextScale[4].sizePx * f),
        },
        label: {
            1: Math.round(tokens_1.appLabelScale[1].sizePx * f),
            2: Math.round(tokens_1.appLabelScale[2].sizePx * f),
            3: Math.round(tokens_1.appLabelScale[3].sizePx * f),
            4: Math.round(tokens_1.appLabelScale[4].sizePx * f),
        },
    };
}
/** Web: inject as CSS variables on :root */
function themeToCssVariables(theme) {
    const { colors, spacing, radius, typography, components, shadows, fontScale } = theme;
    const scale = tokens_1.fontScaleSteps[fontScale];
    const vars = {
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
    [1, 2, 3, 4].forEach((n) => {
        const t = tokens_1.appTextScale[n];
        const sizePx = Math.round(t.sizePx * scale);
        vars[`--app-text-${n}-size`] = `${sizePx}px`;
        vars[`--app-text-${n}-lh`] = String(t.lineHeight);
        vars[`--app-text-${n}-weight`] = String(t.weight);
    });
    [1, 2, 3, 4].forEach((n) => {
        const l = tokens_1.appLabelScale[n];
        const sizePx = Math.round(l.sizePx * scale);
        vars[`--app-label-${n}-size`] = `${sizePx}px`;
        vars[`--app-label-${n}-weight`] = String(l.weight);
        vars[`--app-label-${n}-tracking`] = l.letterSpacing;
    });
    const t1 = Math.round(tokens_1.appTextScale[1].sizePx * scale);
    const t2 = Math.round(tokens_1.appTextScale[2].sizePx * scale);
    const t3 = Math.round(tokens_1.appTextScale[3].sizePx * scale);
    const t4 = Math.round(tokens_1.appTextScale[4].sizePx * scale);
    vars["--font-size-xs"] = `${t1}px`;
    vars["--font-size-sm"] = `${t2}px`;
    vars["--font-size-md"] = `${t3}px`;
    vars["--font-size-lg"] = `${t3}px`;
    vars["--font-size-xl"] = `${t4}px`;
    return vars;
}
