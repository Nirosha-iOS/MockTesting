"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNativeTheme = createNativeTheme;
exports.nativePaperTheme = nativePaperTheme;
exports.textPrimaryStyle = textPrimaryStyle;
exports.surfaceStyle = surfaceStyle;
const theme_1 = require("./theme");
/** React Native: map tokens to style buckets used by the app shell. */
function createNativeTheme(mode = "light", accent = "navy", fontScale = "standard") {
    return (0, theme_1.createTheme)(mode, accent, fontScale);
}
function nativePaperTheme(theme) {
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
function textPrimaryStyle(theme) {
    return {
        color: theme.colors.textPrimary,
        fontSize: theme.typography.fontSizeMd,
        fontFamily: theme.typography.fontFamilyPrimary,
    };
}
function surfaceStyle(theme) {
    return {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
    };
}
