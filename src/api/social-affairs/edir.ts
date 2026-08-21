export type EdirStatus = "ACTIVE" | "EXPIRED" | "REVOKED" | "CANCELLED";

export type EdirLevel = "WOREDA" | "SUB_CITY" | "CITY";

export type EdirCancellationReason =
  | "DISSOLVED"
  | "MEMBER_MAJORITY_REQUEST"
  | "LAWS_VIOLATION"
  | "LICENSE_MISUSE"
  | "FALSE_DOCUMENTS";

export type EdirAssetType = "CASH" | "IN_KIND";

export type EdirDocumentType =
  | "BY_LAWS"
  | "CURRENT_REPORT"
  | "AUDIT_REPORT"
  | "MEETING_MINUTES"
  | "AGREEMENT_LETTER";

export interface EdirFoundingMember {
  id?: number;
  fullName: string;
  address?: string | null;
}

export interface EdirAsset {
  id?: number;
  type: EdirAssetType;
  description: string;
  value: number;
}

export interface EdirDocument {
  id: number;
  type: EdirDocumentType;
  fileName: string;
  fileType: string;
  uploadedAt: string;
}

export interface Edir {
  id?: number;
  name: string;
  establishmentDate: string;
  subCity: string;
  woreda: string;
  kebele: string;
  houseNumber: string;
  specificLocation: string;
  // Flat member fields
  managementMale: number;
  managementFemale: number;
  generalMale: number;
  generalFemale: number;
  bankAccountNumber: string;
  monthlyPaymentDetails: string;
  remark?: string;
  status?: EdirStatus;

  // Directive 151/2016 accreditation fields
  registerLevel?: EdirLevel;
  registrationNumber?: string | null;
  registrationDate?: string | null;
  certificateIssuedAt?: string | null;
  lastRenewedAt?: string | null;
  renewedForYear?: number | null;
  renewalPenaltyApplied?: boolean;
  cancellationReason?: EdirCancellationReason | null;
  cancelledAt?: string | null;
  assetsAuditedByAuditCommittee?: boolean;
  assetsApprovedByGeneralAssembly?: boolean;
  foundingMembers?: EdirFoundingMember[];
  assets?: EdirAsset[];
  byLawsDoc?: EdirDocument | null;

  createdAt?: string;
  updatedAt?: string;
  _count?: {
    members: number;
  };
}

export interface EdirCouncilMember {
  id: number;
  name: string;
  registrationNumber: string | null;
  status: EdirStatus;
  registerLevel: EdirLevel;
  subCity: string;
  woreda: string | null;
  registrationDate: string | null;
}

export interface EdirCouncil {
  id: number;
  name: string;
  level: EdirLevel;
  subCity: string;
  woreda: string | null;
  kebele: string | null;
  establishmentDate: string;
  chairpersonName: string | null;
  chairpersonPhone: string | null;
  contactPhone: string | null;
  address: string | null;
  registrationNumber: string | null;
  registrationDate: string | null;
  certificateIssuedAt: string | null;
  status: EdirStatus;
  lastRenewedAt: string | null;
  renewedForYear: number | null;
  renewalPenaltyApplied: boolean;
  cancellationReason: EdirCancellationReason | null;
  cancelledAt: string | null;
  memberEdirs: EdirCouncilMember[];
  _count?: {
    memberEdirs: number;
  };
  createdAt?: string;
  updatedAt?: string;
}