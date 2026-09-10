export type TimeframeOption = "today" | "7d" | "30d" | "quarter" | "ytd" | "all";

export const ADDIS_ABABA_SUBCITIES = [
  "Bole",
  "Yeka",
  "Kirkos",
  "Arada",
  "Lideta",
  "Addis Ketema",
  "Gulele",
  "Kolfe Keranio",
  "Akaky Kaliti",
  "Nifas Silk-Lafto",
  "Lemi Kura",
] as const;

export type SubCityName = (typeof ADDIS_ABABA_SUBCITIES)[number];

export interface SparklinePoint {
  date: string;
  value: number;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: number | string;
  changePercent?: number; // e.g. +12.4
  changeType?: "positive" | "negative" | "neutral";
  subtitle: string;
  secondaryMetric?: {
    label: string;
    value: string | number;
  };
  sparkline?: SparklinePoint[];
  colorTheme: "blue" | "emerald" | "violet" | "amber" | "rose" | "teal";
}

export interface SubCityStat {
  name: string;
  totalChildren: number;
  vulnerableCitizens: number;
  totalFacilities: number;
  activeEdirs: number;
  complianceRate: number; // 0 to 100
  recentActivityCount: number;
}

export interface DirectorateSummary {
  childrenAffairs: {
    totalChildren: number;
    inCare: number;
    found: number;
    adopted: number;
    fostered: number;
    totalApplicants: number;
    totalFacilities: number;
    capacityOccupancy: number; // e.g. 78%
  };
  socialRehab: {
    totalVulnerable: number;
    elderly: number;
    disability: number;
    womenVulnerable: number;
    totalEdirs: number;
    totalMembers: number;
    supportServicesDelivered: number;
  };
  womenAffairs: {
    totalProfiles: number;
    technologyKits: number;
    vocationalTrainings: number;
    jobPlacements: number;
    activeAssociations: number;
    associationMembers: number;
  };
  reportingCompliance: {
    expectedReports: number;
    submittedReports: number;
    pendingApproval: number;
    complianceRate: number;
    avgReviewDays: number;
  };
}
