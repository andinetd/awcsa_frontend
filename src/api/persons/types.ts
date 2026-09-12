export type TimelineKind =
  | "SUPPORT_RECORD"
  | "SERVICE_REQUEST"
  | "TRAINING"
  | "JOB_PLACEMENT"
  | "ELIGIBILITY_ASSESSMENT"
  | "WOMEN_TECH_SUPPORT"
  | "WOMEN_TRAINING"
  | "WOMEN_EMPLOYMENT"
  | "ASSOCIATION_MEMBERSHIP"
  | "CASE_NOTE"
  | "AUDIT_LOG";

export interface TimelineEntry {
  kind: TimelineKind;
  date: string; // ISO date string from JSON
  payload: Record<string, any>;
}

export interface PersonProfileSummary {
  hasWomenProfile: boolean;
  hasDisabilityProfile: boolean;
  hasElderlyProfile: boolean;
}

export interface PersonSearchResult {
  id: number;
  firstName: string;
  lastName: string;
  cityIdNumber: string | null;
  faydaId: string | null;
  faydaKycStatus: string | null;
  phoneNumber: string | null;
  clientCategory: string;
  subCity: string | null;
  woreda: string | null;
  activeStatus: boolean;
  isDeleted: boolean;
  profiles: PersonProfileSummary;
}

export interface PersonSearchResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  results: PersonSearchResult[];
}

export interface HistorySummary {
  totalEvents: number;
  supportRecords: number;
  serviceRequests: number;
  trainings: number;
  jobPlacements: number;
  womenTechSupports: number;
  womenEmployments: number;
  associationMemberships: number;
}

export interface PersonHistoryResponse {
  client: Record<string, any>;
  summary: HistorySummary;
  timeline: TimelineEntry[];
}

export interface PersonSearchParams {
  q?: string;
  cityIdNumber?: string;
  faydaId?: string;
  page?: number;
  limit?: number;
}
