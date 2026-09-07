export type BeneficiaryCategory = "ELDERLY" | "DISABLED";

export type Sex = "MALE" | "FEMALE" | "OTHER";
export type EmploymentStatus = "EMPLOYED" | "UNEMPLOYED";
export type MaritalStatus = "MARRIED" | "UNMARRIED";
export type WorkplaceCondition = "OWN_PRIVATE" | "KEBELE_PUBLIC" | "RENTED";
export type DisabilitySeverity = "MILD" | "MODERATE" | "SEVERE" | "PROFOUND";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type EligibilityStatus = "ELIGIBLE" | "NOT_ELIGIBLE" | "PENDING";

export type ServiceType =
  | "VOCATIONAL_TRAINING"
  | "PHYSICAL_SUPPORT_ASSISTIVE_DEVICE"
  | "INSTITUTIONAL_SERVICE"
  | "ALLOWANCE_SUBSIDY"
  | "LEGAL_COUNSELING"
  | "PSYCHOLOGICAL_COUNSELING"
  | "COOPERATION_LETTER"
  | "MEDICAL_TREATMENT";

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  VOCATIONAL_TRAINING: "Vocational Training",
  PHYSICAL_SUPPORT_ASSISTIVE_DEVICE: "Physical Support / Assistive Device",
  INSTITUTIONAL_SERVICE: "Institutional Service",
  ALLOWANCE_SUBSIDY: "Allowance / Subsidy",
  LEGAL_COUNSELING: "Legal Counseling",
  PSYCHOLOGICAL_COUNSELING: "Psychological Counseling",
  COOPERATION_LETTER: "Cooperation / Support Letter",
  MEDICAL_TREATMENT: "Free Medical Treatment",
};

export type ServiceStatus =
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REFERRED"
  | "IN_PROGRESS"
  | "PROVIDED"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED";

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  REQUESTED: "Requested",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REFERRED: "Referred",
  IN_PROGRESS: "In Progress",
  PROVIDED: "Provided",
  CONFIRMED: "Confirmed",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

export type DocumentType =
  | "RESIDENCE"
  | "MEDICAL"
  | "VULNERABILITY"
  | "TRAINING"
  | "REFERRAL"
  | "CONFIRMATION"
  | "SERVICE_CONFIRMATION"
  | "OTHER";

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  RESIDENCE: "Residence Evidence",
  MEDICAL: "Medical Evidence",
  VULNERABILITY: "Vulnerability / Support Letter",
  TRAINING: "Training Document",
  REFERRAL: "Referral Letter",
  CONFIRMATION: "Confirmation Document",
  SERVICE_CONFIRMATION: "Service Confirmation",
  OTHER: "Other",
};

export type TrainingField =
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

export const TRAINING_FIELD_LABELS: Record<TrainingField, string> = {
  AGRICULTURE: "Agriculture",
  BUSINESS: "Business",
  HOTEL_HOSPITALITY: "Hotel & Hospitality",
  HOUSE_CONSTRUCTION: "House Construction",
  AUTOMOTIVE: "Automotive",
  ELECTRICITY: "Electricity",
  ICT: "ICT",
  MUNICIPALITY_ADMIN: "Municipality Admin",
  ROAD_CONSTRUCTION: "Road Construction",
  AGRO_PROCESSING: "Agro Processing",
  FURNITURE_MAKING: "Furniture Making",
  TEXTILE_GARMENT: "Textile / Garment",
  LEATHER_WORK: "Leather Work",
  METAL_WORKING: "Metal Working",
  OTHER: "Other",
};

export interface AddressFields {
  subCity?: string;
  woreda?: string;
  zone?: string;
  block?: string;
  houseNumber?: string;
}

export interface DisabilityProfileFull {
  id: number;
  clientId: number;
  disabilityType: string;
  disabilitySeverity?: DisabilitySeverity | null;
  cause?: string | null;
  medicalVerificationStatus: VerificationStatus;
  verifyingInstitution?: string | null;
  verificationDate?: string | null;
  requiresPhysicalAssistance: boolean;
  requiredAssistiveDevice?: string | null;
  otherSupportRequirements?: string | null;
  preferredTraining1?: TrainingField | null;
  preferredTraining2?: TrainingField | null;
  preferredTraining3?: TrainingField | null;
  previousTraining: boolean;
  previousProfession?: string | null;
  workplaceCondition?: WorkplaceCondition | null;
  previousSupport?: string | null;
  supportConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ElderlyProfileFull {
  id: number;
  clientId: number;
  preferredTraining1?: TrainingField | null;
  preferredTraining2?: TrainingField | null;
  preferredTraining3?: TrainingField | null;
  previousTraining: boolean;
  previousProfession?: string | null;
  workplaceCondition?: WorkplaceCondition | null;
  previousSupport?: string | null;
  supportConfirmed: boolean;
  requiredSupportType?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AllowancePayment {
  id: number;
  serviceRequestId: number;
  amount: number;
  paymentDate: string;
  paymentPeriod?: string | null;
  responsibleOffice?: string | null;
  referenceNumber?: string | null;
  paymentStatus?: string;
  supportingDocId?: number | null;
  remarks?: string | null;
}

export interface AssistiveDeviceRequest {
  id: number;
  serviceRequestId: number;
  requestType: "PHYSICAL_SUPPORT" | "ASSISTIVE_DEVICE" | "PROSTHETIC" | "OTHER";
  description?: string | null;
  medicalVerified: boolean;
  eligibilityStatus: EligibilityStatus;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  serviceProvider?: string | null;
  dateProvided?: string | null;
  confirmationStatus: "PENDING" | "CONFIRMED" | "REJECTED";
}

export interface ReferralLetter {
  id: number;
  serviceRequestId: number;
  destinationInstitution: string;
  reason?: string | null;
  requestedService?: string | null;
  letterDate: string;
  responsibleEmployeeId?: number | null;
  status: "DRAFT" | "SENT" | "ACKNOWLEDGED" | "COMPLETED" | "CANCELLED";
  response?: string | null;
  attachedDocId?: number | null;
}

export interface ServiceRequest {
  id: number;
  clientId: number;
  serviceType: ServiceType;
  requestDate: string;
  serviceDate?: string | null;
  status: ServiceStatus;
  responsibleOffice?: string | null;
  responsibleEmployeeId?: number | null;
  remarks?: string | null;
  subCity?: string | null;
  woreda?: string | null;
  confirmationConfirmedById?: number | null;
  confirmationConfirmedAt?: string | null;
  confirmationMethod?: string | null;
  allowance?: AllowancePayment | null;
  assistiveDevice?: AssistiveDeviceRequest | null;
  referral?: ReferralLetter | null;
  createdAt: string;
  updatedAt: string;
}

export interface EligibilityAssessment {
  id: number;
  clientId: number;
  assessedAt: string;
  residencyVerified: boolean;
  residenceEvidence?: string | null;
  communityConfirmation: boolean;
  woredaConfirmation: boolean;
  economicVulnerabilityEvidence?: string | null;
  medicalEvidenceSubmitted: boolean;
  medicalVerificationStatus: VerificationStatus;
  verifyingInstitution?: string | null;
  medicalVerificationDate?: string | null;
  decision: EligibilityStatus;
  decisionNotes?: string | null;
  decisionMakerId?: number | null;
  decisionDate?: string | null;
  rejectionReason?: string | null;
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BeneficiaryDocument {
  id: number;
  clientId: number;
  serviceRequestId?: number | null;
  documentType: DocumentType;
  fileId: number;
  verificationStatus: VerificationStatus;
  remarks?: string | null;
  uploadedAt: string;
  updatedAt: string;
}

export interface CaseNote {
  id: number;
  clientId: number;
  authorId?: number | null;
  note: string;
  category?: string | null;
  createdAt: string;
  author?: { firstName: string; lastName: string } | null;
}

export interface Beneficiary {
  id: number;
  faydaId?: string | null;
  cityIdNumber?: string | null;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  age?: number | null;
  dateOfBirth?: string | null;
  sex?: Sex | null;
  educationLevel?: string | null;
  occupation?: string | null;
  employmentStatus?: EmploymentStatus | null;
  maritalStatus?: MaritalStatus | null;
  monthlyIncome?: number | null;
  familyMembersCount?: number | null;
  address?: string | null;
  subCity?: string | null;
  woreda?: string | null;
  zone?: string | null;
  block?: string | null;
  houseNumber?: string | null;
  clientCategory: BeneficiaryCategory;
  activeStatus: boolean;
  createdAt: string;
  updatedAt: string;
  DisabilityProfile?: DisabilityProfileFull | null;
  ElderlyProfile?: ElderlyProfileFull | null;
  ServiceRequest?: ServiceRequest[];
  EligibilityAssessment?: EligibilityAssessment[];
  BeneficiaryDocument?: BeneficiaryDocument[];
  CaseNote?: CaseNote[];
}

export interface BeneficiarySearchParams {
  q?: string;
  by?: "fayda" | "name" | "phone" | "cityId";
  category?: BeneficiaryCategory;
  subCity?: string;
  woreda?: string;
  disabilityType?: string;
  page?: number;
  pageSize?: number;
}

export interface BeneficiarySearchResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Beneficiary[];
}

export interface DashboardCounts {
  elderlyTotal: number;
  disabledTotal: number;
  beneficiariesTotal: number;
  pendingEligibility: number;
  pendingConfirmation: number;
  requestedServices: number;
}

export interface CreateElderlyPayload {
  faydaId: string;
  cityIdNumber?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  age?: number;
  dateOfBirth?: string;
  sex?: Sex;
  educationLevel?: string;
  occupation?: string;
  employmentStatus?: EmploymentStatus;
  maritalStatus?: MaritalStatus;
  familyMembersCount?: number;
  address?: string;
  subCity?: string;
  woreda?: string;
  zone?: string;
  block?: string;
  houseNumber?: string;
  preferredTraining1?: TrainingField;
  preferredTraining2?: TrainingField;
  preferredTraining3?: TrainingField;
  previousTraining?: boolean;
  previousProfession?: string;
  workplaceCondition?: WorkplaceCondition;
  previousSupport?: string;
  supportConfirmed?: boolean;
  requiredSupportType?: string;
}

export type UpdateBeneficiaryPayload = Partial<CreateElderlyPayload>;

export interface CreateDisabledPayload extends CreateElderlyPayload {
  disabilityType: string;
  disabilitySeverity?: DisabilitySeverity;
  cause?: string;
  requiresPhysicalAssistance?: boolean;
  requiredAssistiveDevice?: string;
  otherSupportRequirements?: string;
}

export interface CreateEligibilityPayload {
  residencyVerified?: boolean;
  residenceEvidence?: string;
  communityConfirmation?: boolean;
  woredaConfirmation?: boolean;
  economicVulnerabilityEvidence?: string;
  medicalEvidenceSubmitted?: boolean;
  medicalVerificationStatus?: VerificationStatus;
  verifyingInstitution?: string;
  medicalVerificationDate?: string;
  remarks?: string;
}

export interface DecideEligibilityPayload {
  decision: EligibilityStatus;
  decisionNotes?: string;
  rejectionReason?: string;
}

export interface AllowanceDetails {
  amount: number;
  paymentDate: string;
  paymentPeriod?: string;
  referenceNumber?: string;
  paymentStatus?: string;
  remarks?: string;
}

export interface AssistiveDeviceDetails {
  requestType: "PHYSICAL_SUPPORT" | "ASSISTIVE_DEVICE" | "PROSTHETIC" | "OTHER";
  description?: string;
  medicalVerified?: boolean;
  serviceProvider?: string;
  dateProvided?: string;
}

export interface ReferralDetails {
  destinationInstitution: string;
  reason?: string;
  requestedService?: string;
  letterDate?: string;
}

export interface CreateServiceRequestPayload {
  serviceType: ServiceType;
  serviceDate?: string;
  responsibleOffice?: string;
  responsibleEmployeeId?: number;
  remarks?: string;
  subCity?: string;
  woreda?: string;
  allowance?: AllowanceDetails;
  assistiveDevice?: AssistiveDeviceDetails;
  referral?: ReferralDetails;
}

export interface UpdateServiceStatusPayload {
  status: ServiceStatus;
  remarks?: string;
}

export interface ConfirmServicePayload {
  confirmationMethod?: string;
  remarks?: string;
  evidenceDocumentId?: number;
}

export interface CreateDocumentPayload {
  documentType: DocumentType;
  serviceRequestId?: number;
  fileId: number;
  verificationStatus?: VerificationStatus;
  remarks?: string;
}

export interface CreateCaseNotePayload {
  note: string;
  category?: string;
}

export interface CaseHistoryResponse {
  client: Beneficiary;
  timeline: Array<{
    kind:
      | "SERVICE_REQUEST"
      | "ELIGIBILITY"
      | "TRAINING"
      | "JOB"
      | "SUPPORT"
      | "NOTE"
      | "AUDIT";
    date: string;
    payload: any;
  }>;
}

export interface FaydaVerificationResult {
  faydaId: string;
  verified: boolean;
  fullName?: string;
  dateOfBirth?: string;
  region?: string;
  source: "MOCK";
  verifiedAt: string;
  reason?: string;
}

export interface ReportFilters {
  category:
    | "BENEFICIARY"
    | "SERVICE"
    | "TRAINING"
    | "SUPPORT"
    | "ELIGIBILITY";
  startDate: string;
  endDate: string;
  subCity?: string;
  woreda?: string;
  serviceType?: string;
  status?: string;
  beneficiaryCategory?: BeneficiaryCategory | "ALL";
  disabilityType?: string;
  format: "EXCEL" | "PDF";
}
