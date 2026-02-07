import { Client } from "../womens/women-profile";

export type BeneficiaryType = "DISABLED" | "ELDERLY";

export interface DisabilityProfile {
  id: number;
  clientId: number;
  disabilityType: string;
  cause: string;
  createdAt: string;
  updatedAt: string;
}

export interface ElderlyProfile {
  id: number;
  clientId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Beneficiary {
  id: number;
  cityIdNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string | null;
  dateOfBirth: string | null;
  clientCategory: BeneficiaryType;
  educationLevel: string | null;
  occupation: string | null;
  familyMembersCount: number;
  activeStatus: boolean;
  createdAt: string;
  updatedAt: string;
  DisabilityProfile?: DisabilityProfile | null;
  ElderlyProfile?: ElderlyProfile | null;
  TrainingRecord?: TrainingRecord[];
  JobPlacement?: JobPlacement[];
}

// To maintain compatibility with existing code during transition
export type DisabilityInfo = Beneficiary;
export type ElderlyInfo = Beneficiary;

export type TrainingType =
  | "AGRICULTURE"
  | "BUSINESS"
  | "HOTEL_HOSPITALITY"
  | "HOUSE_CONSTRUCTION"
  | "AUTOMOTIVE"
  | "ELECTRICITY"
  | "ICT"
  | "MUNICIPALITY_ADMIN"
  | "ROAD_CONSTRUCTION"
  | "AGRO_PROCESSING"
  | "FURNITURE_MAKING"
  | "TEXTILE_GARMENT"
  | "LEATHER_WORK"
  | "METAL_WORKING"
  | "OTHER";

export interface TrainingRecord {
  id: number;
  cityIdNumber: string;
  trainingType: TrainingType;
  provider: string;
  startDate: string;
  completionDate?: string;
  dropoutDate?: string;
  dropoutReason?: string;
  hasCOC: boolean;
  remark?: string;
  createdAt: string;
  updatedAt: string;
  client?: Beneficiary;
}

export interface JobPlacement {
  id: number;
  cityIdNumber: string;
  companyIdNumber: string;
  jobTitle: string;
  startDate: string;
  remark?: string;
  createdAt: string;
  updatedAt: string;
  client?: Beneficiary;
}

export interface RegistrationPayload {
  cityIdNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth?: string;
  address?: string;
  educationLevel?: string;
  occupation?: string;
  familyMembersCount?: number;
  // Specific fields
  disabilityType?: string;
  disabilityLevel?: string;
  cause?: string;
  type: BeneficiaryType;
}

export interface TrainingPayload {
  cityIdNumber: string;
  trainingType: TrainingType;
  provider: string;
  startDate: string;
  completionDate?: string;
  dropoutDate?: string;
  dropoutReason?: string;
  hasCOC: boolean;
  remark?: string;
}

export interface JobPayload {
  cityIdNumber: string;
  companyIdNumber: string;
  jobTitle: string;
  startDate: string;
  remark?: string;
}

export interface BeneficiaryReportPayload {
  category: "REGISTRATION" | "TRAINING" | "JOBS";
  beneficiaryType: BeneficiaryType | "ALL";
  startDate: string;
  endDate: string;
  subCity: string;
  woreda: string;
  format: "EXCEL" | "PDF";
  selectedColumns: string[];
}

export type ServiceCategory =
  | "FINANCIAL"
  | "MEDICAL"
  | "SUPPLIES"
  | "EDUCATION"
  | "TRAINING"
  | "LEGAL"
  | "COUNSELING" // From "Psychosocial Counseling"
  | "SHELTER"
  | "OTHER";

export type ServiceFrequency =
  | "ONE_TIME"
  | "RECURRING_MONTHLY"
  | "RECURRING_YEARLY"
  | "AS_NEEDED";

export interface SupportServicePayload {
  cityIdNumber: string;
  serviceTypeId: number;
  provider: string;
  amountOrQuantity?: string; // Schema shows string "5000"
  dateProvided: string;
  subCity: string;
  woreda: string;
  remark?: string;
  facilitatorCityId?: string;
}

export interface SupportService {
  id: number;
  cityIdNumber: string;
  serviceTypeId: number;
  provider: string;
  amountOrQuantity: string;
  dateProvided: string;
  subCity: string;
  woreda: string;
  remark?: string;
  facilitatorCityId?: string;
  createdAt: string;
  updatedAt: string;
  client?: Beneficiary;
  // We might want to include the mocked service details here if backend doesn't populate them
  serviceName?: string;
  category?: ServiceCategory;
  frequency?: ServiceFrequency;
}
