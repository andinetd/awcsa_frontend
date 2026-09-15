import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";

export type BackendApplicantInfo = {
  applicantId?: number;
  id?: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationalId?: string;
  cityIdNumber?: string;
  spouseCityIdNumber?: string | null;
  phoneNumber?: string;
  email?: string;
  address?: string;
  subCity?: string;
  woreda?: string;
  kebele?: string;
  houseNumber?: string;
  educationLevel?: string;
  occupation?: string;
  monthlyIncome?: number | null;
  familyMembersCount?: number | null;
};

export type BackendApplicationInfo = {
  serviceDataId?: number;
  submittedAt?: string;
  status?: string;
  rejectionReason?: string;
  submissionDate?: string;
  eligibleDate?: string | null;
  spouseAgreement?: boolean;
  preferredChildren?: {
    sex?: string;
    number?: number;
    ageRange?: { min?: number; max?: number };
  } | null;
  applicant?: {
    applicantId?: number;
    fullName?: string;
    nationalId?: string;
    phoneNumber?: string;
    email?: string;
  };
  attachments?: Array<{
    fileName?: string;
    fileUrl?: string;
    url?: string;
    fileType?: string;
  }>;
  documents?: Array<{
    publicId: string;
    fieldName: string;
    fileType: string;
    fileName: string;
  }>;
};

export type BackendReviewInfo = {
  region?: string;
  subCity?: string;
  woreda?: string;
  kebele?: string;
  houseNo?: string;
  remark?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BackendAdoptionApplication = {
  applicationId: number;
  status: string;
  applicantInfo: BackendApplicantInfo;
  applicationInfo: BackendApplicationInfo;
  reviewInfo?: BackendReviewInfo;
  matchedChildId?: number | null;
  hasHomeVisitForm?: boolean;
};

export const getAdoptionApplications = async (
  status = "ALL"
): Promise<BackendAdoptionApplication[]> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/adoption/applications?Status=${status}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = res.data;
  if (Array.isArray(data)) {
    return data;
  } else if (data && Array.isArray(data.items)) {
    return data.items;
  }
  return [];
};
