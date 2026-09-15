import { Inter, Noto_Sans_Ethiopic, JetBrains_Mono } from "next/font/google";

/**
 * ============================================================================
 * UNIFIED FONT CONFIGURATION (AWCSA Portal)
 * ============================================================================
 * To switch or customize fonts for the entire application, simply adjust
 * the font definitions below. The changes will automatically propagate to:
 * - HTML / Body tag via fontVariables
 * - Tailwind CSS theme utilities (`font-sans`, `font-mono`, etc.)
 * - globals.css base rules
 * ============================================================================
 */

// 1. Primary Sans-Serif Font (Used for body text, UI controls, navigation)
export const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// 2. Ethiopian / Amharic Font (Optimized for Amharic script throughout the portal)
export const fontEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-ethiopic",
  subsets: ["ethiopic", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// 3. Monospace Font (Used for KPI numbers, timestamps, audit IDs, tabular data)
export const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/**
 * Combined CSS class names to apply to <html> or <body> in root layout
 */
export const fontVariables = `${fontSans.variable} ${fontEthiopic.variable} ${fontMono.variable}`;

/**
 * Font metadata object for programmatic access across the app
 */
export const siteFonts = {
  sans: {
    name: "Inter",
    variable: "var(--font-sans)",
    className: fontSans.className,
  },
  ethiopic: {
    name: "Noto Sans Ethiopic",
    variable: "var(--font-ethiopic)",
    className: fontEthiopic.className,
  },
  mono: {
    name: "JetBrains Mono",
    variable: "var(--font-mono)",
    className: fontMono.className,
  },
};

/**
 * ============================================================================
 * UNIFIED FONT SIZE SCALE
 * ============================================================================
 * Centralized typography scale for the whole website.
 * Adjusting `baseRoot` or individual sizes here and in globals.css adjusts
 * the entire website typography proportionally.
 * ============================================================================
 */
export const fontSizes = {
  // Default base root font size applied to <html> / <body>
  baseRoot: "14px",

  // Proportional scale tokens
  scale: {
    "2xs": "0.6875rem", // 11px - Micro indicators, sub-city badges, tag pills
    xs: "0.75rem",      // 12px - Labels, secondary metadata, table headers
    sm: "0.8125rem",    // 13px - Compact text, inputs, secondary links
    base: "0.875rem",   // 14px - Default body text, card descriptions
    md: "1rem",         // 16px - Subheadings, navigation items
    lg: "1.125rem",     // 18px - Card titles, modal headers
    xl: "1.25rem",      // 20px - Section titles, highlight headers
    "2xl": "1.5rem",    // 24px - Page titles, directorate headings
    "3xl": "1.875rem",  // 30px - Major KPI metrics
    "4xl": "2.25rem",   // 36px - Hero banners, large counters
  },
} as const;

export type FontSizeScale = typeof fontSizes;
