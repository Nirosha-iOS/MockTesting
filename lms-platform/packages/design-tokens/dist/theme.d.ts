import { breakpointTokens, colorTokens, componentTokens, iconSizeTokens, radiusTokens, shadowTokens, shadowTokensDark, spacingTokens, typographyTokens, type AccentId, type FontScaleId } from "./tokens";
export type ThemeMode = "light" | "dark";
export type { AccentId };
/** Runtime palette (accent overrides primary family; all channels are string hex for TS simplicity). */
export type ThemeColorPalette = {
    [K in keyof typeof colorTokens]: string;
};
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
export declare function createTheme(mode?: ThemeMode, accent?: AccentId, fontScale?: FontScaleId): LmsTheme;
/** Pixel sizes after font scale (for settings UI). */
export declare function getScaledTypographyPx(fontScale: FontScaleId): {
    readonly text: {
        readonly 1: number;
        readonly 2: number;
        readonly 3: number;
        readonly 4: number;
    };
    readonly label: {
        readonly 1: number;
        readonly 2: number;
        readonly 3: number;
        readonly 4: number;
    };
};
/** Web: inject as CSS variables on :root */
export declare function themeToCssVariables(theme: LmsTheme): Record<string, string>;
