/**
 * Single source of truth for visual design.
 * Admin web and mobile map these tokens to CSS variables / StyleSheet.
 */
export declare const colorTokens: {
    readonly primary: "#1E3A5F";
    readonly primaryDark: "#152A45";
    readonly secondary: "#3B82F6";
    readonly accent: "#F59E0B";
    readonly success: "#16A34A";
    readonly warning: "#D97706";
    readonly error: "#DC2626";
    readonly info: "#0284C7";
    readonly textPrimary: "#0F172A";
    readonly textSecondary: "#475569";
    readonly background: "#F8FAFC";
    readonly surface: "#FFFFFF";
    readonly border: "#E2E8F0";
    readonly disabled: "#94A3B8";
    readonly placeholder: "#94A3B8";
};
export declare const colorTokensDark: {
    readonly textPrimary: "#F1F5F9";
    readonly textSecondary: "#CBD5E1";
    readonly background: "#0F172A";
    readonly surface: "#1E293B";
    readonly border: "#334155";
    readonly primary: "#1E3A5F";
    readonly primaryDark: "#152A45";
    readonly secondary: "#3B82F6";
    readonly accent: "#F59E0B";
    readonly success: "#16A34A";
    readonly warning: "#D97706";
    readonly error: "#DC2626";
    readonly info: "#0284C7";
    readonly disabled: "#94A3B8";
    readonly placeholder: "#94A3B8";
};
export declare const spacingTokens: {
    readonly xxs: 2;
    readonly xs: 4;
    readonly sm: 8;
    readonly md: 12;
    readonly lg: 16;
    readonly xl: 24;
    readonly xxl: 32;
};
export declare const radiusTokens: {
    readonly sm: 4;
    readonly md: 8;
    readonly lg: 12;
    readonly xl: 16;
};
export declare const typographyTokens: {
    readonly fontFamilyPrimary: "Inter, system-ui, sans-serif";
    readonly fontFamilySecondary: "Georgia, serif";
    readonly fontWeightRegular: "400";
    readonly fontWeightMedium: "500";
    readonly fontWeightSemibold: "600";
    readonly fontWeightBold: "700";
    readonly fontSizeXs: 12;
    readonly fontSizeSm: 14;
    readonly fontSizeMd: 16;
    readonly fontSizeLg: 18;
    readonly fontSizeXl: 22;
    readonly labelSizeSm: 11;
    readonly labelSizeMd: 12;
    readonly labelSizeLg: 13;
    readonly lineHeightTight: 1.2;
    readonly lineHeightNormal: 1.5;
};
/** Four body / UI text levels — use these sizes only (mapped to legacy --font-size-* in theme). */
export declare const appTextScale: {
    readonly 1: {
        readonly sizePx: 12;
        readonly lineHeight: 1.45;
        readonly weight: 400;
    };
    readonly 2: {
        readonly sizePx: 14;
        readonly lineHeight: 1.5;
        readonly weight: 400;
    };
    readonly 3: {
        readonly sizePx: 16;
        readonly lineHeight: 1.35;
        readonly weight: 600;
    };
    readonly 4: {
        readonly sizePx: 22;
        readonly lineHeight: 1.25;
        readonly weight: 700;
    };
};
/** Four label levels (forms, tags, column headers). */
export declare const appLabelScale: {
    readonly 1: {
        readonly sizePx: 10;
        readonly weight: 600;
        readonly letterSpacing: "0.06em";
    };
    readonly 2: {
        readonly sizePx: 11;
        readonly weight: 600;
        readonly letterSpacing: "0.02em";
    };
    readonly 3: {
        readonly sizePx: 12;
        readonly weight: 600;
        readonly letterSpacing: "0.01em";
    };
    readonly 4: {
        readonly sizePx: 14;
        readonly weight: 600;
        readonly letterSpacing: "0";
    };
};
/** Five brand accents (primary / primaryDark / secondary). */
export declare const accentPresets: {
    readonly navy: {
        readonly primary: "#1E3A5F";
        readonly primaryDark: "#152A45";
        readonly secondary: "#3B82F6";
    };
    readonly ocean: {
        readonly primary: "#0E7490";
        readonly primaryDark: "#155E75";
        readonly secondary: "#06B6D4";
    };
    readonly violet: {
        readonly primary: "#5B21B6";
        readonly primaryDark: "#4C1D95";
        readonly secondary: "#8B5CF6";
    };
    readonly emerald: {
        readonly primary: "#065F46";
        readonly primaryDark: "#064E3B";
        readonly secondary: "#10B981";
    };
    readonly amber: {
        readonly primary: "#B45309";
        readonly primaryDark: "#92400E";
        readonly secondary: "#F59E0B";
    };
};
export type AccentId = keyof typeof accentPresets;
/** Multiplier for all text and label step sizes (Settings → Typography). */
export declare const fontScaleSteps: {
    readonly compact: 0.9;
    readonly standard: 1;
    readonly comfortable: 1.12;
};
export type FontScaleId = keyof typeof fontScaleSteps;
export declare const componentTokens: {
    readonly inputHeightSm: 32;
    readonly inputHeightMd: 40;
    readonly inputHeightLg: 48;
    readonly buttonHeightSm: 32;
    readonly buttonHeightMd: 40;
    readonly buttonHeightLg: 48;
    readonly chipHeight: 28;
    readonly cardRadius: 8;
    readonly modalRadius: 12;
    readonly tableRowHeight: 44;
    readonly appBarHeight: 56;
    readonly sidebarWidth: 260;
};
export declare const shadowTokens: {
    readonly card: "0 1px 3px rgba(15, 23, 42, 0.12)";
    readonly modal: "0 10px 40px rgba(15, 23, 42, 0.18)";
};
export declare const shadowTokensDark: {
    readonly card: "0 1px 3px rgba(0, 0, 0, 0.35)";
    readonly modal: "0 10px 40px rgba(0, 0, 0, 0.5)";
};
export declare const breakpointTokens: {
    readonly sm: 640;
    readonly md: 768;
    readonly lg: 1024;
    readonly xl: 1280;
};
export declare const iconSizeTokens: {
    readonly sm: 16;
    readonly md: 20;
    readonly lg: 24;
};
export type ColorTokenKey = keyof typeof colorTokens;
export type SpacingTokenKey = keyof typeof spacingTokens;
