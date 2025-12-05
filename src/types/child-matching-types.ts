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
  currentStatus?: string;
  custodianId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  serviceData: ServiceData;
  childCareFacility?: {
    id: number;
    name: string;
  } | null;
}

export interface MatchRequest {
  childIdFromFacility: string;
  applicantId: number | undefined;
  applicationId: number;
  note?: string;
}
