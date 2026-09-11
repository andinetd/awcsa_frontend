// Represents the nested `formData` inside the serviceData for a child
interface ChildFormData {
  sex?: string;
  lastName?: string;
  firstName?: string;
  dateOfBirth?: string;
  currentStatus?: string;
  additionalInfo?: string;
  timeWhenChildFound?: string;
  placeWhereChildFound?: string;
  socialWorkerCityIdNumber?: string;
}

interface Client {
  id: number;
  cityIdNumber?: string | null;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  clientCategory?: string | null;
  contactInfo?: Record<string, any> | null;
}

interface ServiceData {
  id: number;
  clientId?: number;
  employeeId?: number | null;
  formData: ChildFormData;
  status?: string;
  client?: Client;
}

export interface ChildCareFacility {
  id: number;
  name: string;
  place: string;
  type: string;
  childrenAgeRange?: {
    max: number;
    min: number;
  };
  phone?: string | null;
  email?: string | null;
  region?: string | null;
  subCity?: string | null;
  woreda?: string | null;
  kebele?: string | null;
  houseNumber?: string | null;
  description?: string | null;
  orgUnitId?: number;
  createdAt?: string;
  updatedAt?: string;
  // Account Info
  contactPerson?: string;
  loginUsername?: string;
}
export type ChildStatus =
  | "FOUND"
  | "IN_CARE"
  | "IN_ADERA"
  | "WITH_BLOOD_RELATIVE"
  | "ADOPTED"
  | "RETURNED";

export const ALLOWED_CHILD_TRANSITIONS: Record<ChildStatus, ChildStatus[]> = {
  FOUND: ["IN_CARE", "IN_ADERA", "WITH_BLOOD_RELATIVE", "RETURNED"],
  IN_CARE: ["IN_ADERA", "WITH_BLOOD_RELATIVE", "RETURNED"],
  IN_ADERA: ["IN_CARE", "WITH_BLOOD_RELATIVE", "RETURNED"],
  WITH_BLOOD_RELATIVE: ["IN_CARE", "RETURNED"],
  RETURNED: ["IN_CARE", "IN_ADERA"],
  ADOPTED: [],
};

// Main Child interface that matches the example payload
export interface Child {
  id: number;
  serviceDataId: number;
  childCareFacilityId?: number | null;
  childIdFromFacility?: string | null;
  reasonForReturn?: string | null;
  placeWhereChildFound?: string;
  timeWhenChildFound?: string;
  socialWorkerCityIdNumber?: string;
  additionalInfo?: string;
  currentStatus?: ChildStatus | string;
  custodianId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  serviceData: ServiceData;
  childCareFacility?: {
    id: number;
    name: string;
    place?: string;
    type?: string;
    phone?: string | null;
    email?: string | null;
    region?: string | null;
    subCity?: string | null;
    woreda?: string | null;
    kebele?: string | null;
    contactPerson?: string;
  } | null;
  custodian?: Client | null;
  adoptionMatches?: Array<{
    id: number;
    status: string;
    matchedAt: string;
    completedAt?: string | null;
    terminatedAt?: string | null;
    adopter?: Client;
    matchedBy?: {
      id: number;
      firstName: string;
      lastName: string;
      employeeRole?: string;
    };
    application?: ServiceData;
  }>;
  reunifications?: Array<{
    id: number;
    reunificationDate: string;
    fatherName?: string | null;
    motherName?: string | null;
    contactPhoneNumber?: string | null;
    nationalIdNumber?: string | null;
    courtOrderNumber?: string | null;
    reunificationReason?: string;
    socialWorkerNotes?: string | null;
    processedBy?: {
      id: number;
      firstName: string;
      lastName: string;
      employeeRole?: string;
    };
  }>;
  transferHistory?: ChildTransferHistory[];
}

export interface ChildTransferHistory {
  id: number;
  childRegistrationId: number;
  fromStatus: ChildStatus | string;
  toStatus: ChildStatus | string;
  reason?: string | null;
  transferredById?: number | null;
  transferredAt: string;
  childCareFacilityId?: number | null;
  childIdFromFacility?: string | null;
  custodianId?: number | null;
  custodianDetails?: {
    fullName?: string;
    phoneNumber?: string;
    relationship?: string;
    cityIdNumber?: string;
    address?: string;
    notes?: string;
    [key: string]: any;
  } | null;
  additionalNotes?: string | null;
  createdAt?: string;
  transferredBy?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  } | null;
  childCareFacility?: {
    id: number;
    name: string;
    place?: string;
    type?: string;
    phone?: string | null;
    email?: string | null;
    subCity?: string | null;
    woreda?: string | null;
  } | null;
  custodian?: Client | null;
}

export interface MatchRequest {
  childIdFromFacility: string;
  applicantId: number | undefined;
  applicationId: number;
  note?: string;
}
