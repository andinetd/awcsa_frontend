/**
 * Addis Ababa Women, Children & Social Affairs (AWCSA) Design System
 * Unified Color Palettes, Typography, and UI Design Tokens
 */

export const palette = {
  // 1. Primary Bureau Brand Colors
  brand: {
    // Deep Midnight Navy - Primary institutional dark color (Sidebar, hero accents, alert cards, primary intake bars)
    navy: "#0B1F3A",
    navyHover: "#122D52",
    navyActive: "#163863",
    navyDark: "#071527",
    navyLight: "#1E3A5F",

    // Bureau Blue - Action color (active tabs, primary links, buttons, secondary interventions bar)
    blue: "#1769AA",
    blueHover: "#12568E",
    blueActive: "#0E4370",
    blueLight: "#E8F2FA",
    blueSoft: "#F0F7FD",
    blueBorder: "#BCD5EA",
  },

  // 2. Surface & Background Colors
  surface: {
    background: "#F7F8FA",
    card: "#FFFFFF",
    cardMuted: "#FAFAFA",
    border: "#E3E7EB",
    borderLight: "#EEF2F5",
    borderDark: "#CBD5E1",
  },

  // 3. Typography & Text Colors
  text: {
    primary: "#0F172A",     // Deep slate for main headings and large KPIs
    secondary: "#334155",   // Slate-700 for subtitles and section headers
    muted: "#64748B",       // Slate-500 for descriptions and field labels
    subtle: "#94A3B8",      // Slate-400 for timestamps and secondary codes
    white: "#FFFFFF",
    whiteMuted: "#CBD5E1",
  },

  // 4. Semantic & Operational Status Colors
  status: {
    success: {
      main: "#10B981",
      light: "#ECFDF5",
      border: "#A7F3D0",
      text: "#065F46",
    },
    warning: {
      main: "#C98A16",
      light: "#FFFBEB",
      border: "#FDE68A",
      text: "#92400E",
    },
    danger: {
      main: "#DC2626",
      light: "#FEF2F2",
      border: "#FECACA",
      text: "#991B1B",
    },
    info: {
      main: "#0284C7",
      light: "#F0F9FF",
      border: "#BAE6FD",
      text: "#075985",
    },
  },

  // 5. Directorate Domain Palette
  directorate: {
    childWelfare: {
      code: "CW-01",
      name: "Child Welfare & Adoption",
      amharic: "የህጻናት ደህንነትና ማደጎ ዳይሬክቶሬት",
      color: "#1769AA",
      bg: "#E8F2FA",
    },
    socialRehab: {
      code: "SR-02",
      name: "Elderly & Disability Rehabilitation",
      amharic: "የአረጋውያንና የአካል ጉዳተኞች ዳይሬክቶሬት",
      color: "#168C86",
      bg: "#E6F4F3",
    },
    womenAffairs: {
      code: "WD-03",
      name: "Women's Development & Protection",
      amharic: "የሴቶች ልማትና ጥበቃ ዳይሬክቶሬት",
      color: "#74345F",
      bg: "#F7EEF4",
    },
    communityEdir: {
      code: "ED-04",
      name: "Community Edir Safety Net & Councils",
      amharic: "የዕድርና ማህበረሰብ ድጋፍ ዳይሬክቶሬት",
      color: "#0B1F3A",
      bg: "#EAEFF5",
    },
  },

  // 6. Data Visualization & Charts Palette
  charts: {
    // Primary comparative series
    intakeBar: "#0B1F3A",        // New citizen intake (Dark Navy)
    interventionsBar: "#1769AA", // Services & welfare interventions (Civic Blue)
    
    // Demographic Donut / Segment Palette
    demographics: {
      disabled: "#0B1F3A",       // Deep Navy
      elderly: "#1769AA",        // Bureau Blue
      women: "#38BDF8",          // Sky Blue
      children: "#74345F",       // Plum
      other: "#94A3B8",          // Neutral Slate
    },
  },

  // 7. Sidebar Dedicated Tokens
  sidebar: {
    background: "#0B1F3A",
    foreground: "#F8FAFC",
    mutedForeground: "#94A3B8",
    activeBackground: "#142A48",
    activeBorder: "#1769AA",
    hoverBackground: "#0E2646",
    border: "#132C4F",
    groupLabel: "#64748B",
  },

  // 8. Typography & Font Sizes
  typography: {
    baseRoot: "14px",
    fontFamily: {
      sans: "var(--font-sans), var(--font-ethiopic), system-ui, sans-serif",
      ethiopic: "var(--font-ethiopic), 'Noto Sans Ethiopic', 'Nyala', sans-serif",
      mono: "var(--font-mono), monospace",
    },
    fontSize: {
      "2xs": "0.6875rem", // 11px
      xs: "0.75rem",      // 12px
      sm: "0.8125rem",    // 13px
      base: "0.875rem",   // 14px
      md: "1rem",         // 16px
      lg: "1.125rem",     // 18px
      xl: "1.25rem",      // 20px
      "2xl": "1.5rem",    // 24px
      "3xl": "1.875rem",  // 30px
      "4xl": "2.25rem",   // 36px
    },
  },
} as const;

export type DesignSystemPalette = typeof palette;

/**
 * Common style class names generator for unified UI consistency
 */
export const uiTokens = {
  card: "rounded-md border border-[#E3E7EB] bg-white shadow-none",
  cardHover: "rounded-md border border-[#E3E7EB] bg-white shadow-none transition-all hover:border-[#BCD5EA]",
  sectionTitle: "text-xs font-bold uppercase tracking-wider text-slate-500",
  pageTitle: "text-2xl font-bold tracking-tight text-[#0B1F3A]",
  badge: "inline-flex items-center rounded-xs px-2 py-0.5 text-[11px] font-mono font-semibold",
  buttonOutline: "h-8 border border-[#E3E7EB] bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors",
  tabUnderline: "px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2",
  tabActive: "border-[#1769AA] text-[#1769AA]",
  tabInactive: "border-transparent text-slate-600 hover:text-slate-900",
  statusTag: {
    base: "inline-flex items-center rounded-xs px-1.5 py-0.5 text-[10px] font-mono font-medium border leading-none tracking-tight",
    // 100% Design Theme Palette (No traffic light greens/yellows)
    primary: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]", // Bureau Action Blue
    navy: "bg-[#0B1F3A] text-white border-[#0B1F3A]",         // Midnight Navy
    neutral: "bg-slate-100 text-slate-700 border-[#E3E7EB]",  // Slate Municipal
    subtle: "bg-slate-50 text-slate-600 border-[#E3E7EB]",    // Subtle Slate
    activeHover: "bg-[#142A48] text-[#38BDF8] border-[#1769AA]/60", // Card Hover Elevated
    // Semantic mappings bound strictly to Bureau Design Theme:
    success: "bg-slate-100 text-slate-700 border-[#E3E7EB]",
    warning: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
    danger: "bg-[#0B1F3A] text-white border-[#0B1F3A]",
    info: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
  },
};
