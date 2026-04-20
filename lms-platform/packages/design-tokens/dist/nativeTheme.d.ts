import { type LmsTheme } from "./theme";
import type { AccentId, FontScaleId } from "./tokens";
export type NativeTheme = LmsTheme;
/** React Native: map tokens to style buckets used by the app shell. */
export declare function createNativeTheme(mode?: "light" | "dark", accent?: AccentId, fontScale?: FontScaleId): NativeTheme;
export declare function nativePaperTheme(theme: NativeTheme): {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        success: string;
        warning: string;
        error: string;
        info: string;
        text: string;
        textSecondary: string;
        background: string;
        surface: string;
        border: string;
    };
    spacing: {
        readonly xxs: 2;
        readonly xs: 4;
        readonly sm: 8;
        readonly md: 12;
        readonly lg: 16;
        readonly xl: 24;
        readonly xxl: 32;
    };
    radius: {
        readonly sm: 4;
        readonly md: 8;
        readonly lg: 12;
        readonly xl: 16;
    };
    typography: {
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
};
export declare function textPrimaryStyle(theme: NativeTheme): {
    readonly color: string;
    readonly fontSize: 16;
    readonly fontFamily: "Inter, system-ui, sans-serif";
};
export declare function surfaceStyle(theme: NativeTheme): {
    readonly backgroundColor: string;
    readonly borderRadius: 8;
    readonly padding: 12;
};
