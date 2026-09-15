export type TimeframeOption = "this_month" | "last_month" | "quarter" | "ytd" | "all";

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

export interface SubCityStat {
  name: string;
  totalChildren: number;
  vulnerableCitizens: number;
  totalFacilities: number;
  activeEdirs: number;
  complianceRate: number; // 0 to 100
  recentActivityCount: number;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: number | string;
  subtitle: string;
}

export interface DirectorateSummary {
  childrenAffairs: any;
  socialRehab: any;
  womenAffairs: any;
  reportingCompliance: any;
}

export interface OperationalAlertItem {
  id: string;
  category: "OVERDUE_REPORT" | "PENDING_APPROVAL" | "OPEN_COMPLAINT" | "INSPECTION_DUE" | "ADOPTION_REVIEW";
  title: string;
  source: string;
  subCity?: string;
  timestamp: string;
  severity: "critical" | "warning" | "info";
  actionLabel?: string;
  actionUrl?: string;
}

export interface DirectorateMetricRow {
  code: string;
  name: string;
  amharicName: string;
  primaryCaseload: number;
  caseloadLabel: string;
  monthlyIntake: number;
  servicesDelivered: number;
  pendingReviews: number;
  complianceRate: number; // percentage
  statusTheme: "blue" | "teal" | "amber" | "plum";
}

export interface SubCityComparativeRow {
  name: string;
  totalBeneficiaries: number;
  childrenInCare: number;
  elderlyAndDisabled: number;
  womenBeneficiaries: number;
  licensedFacilities: number;
  registeredEdirs: number;
  complianceRate: number;
  pendingReports: number;
  openComplaints: number;
}
