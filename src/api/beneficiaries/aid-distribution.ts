import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

const authHeader = () => ({
  Authorization: `Bearer ${useAuthStore.getState().token}`,
  "Content-Type": "application/json",
});

export interface AidDistributionClient {
  id: number;
  firstName: string;
  lastName: string;
  grandfatherName?: string | null;
  sex: "MALE" | "FEMALE";
  age?: number | null;
  phoneNumber?: string | null;
  woreda?: string | null;
  subCity?: string | null;
  clientCategory: "DISABILITY" | "ELDERLY" | "BOTH";
  faydaId?: string | null;
  houseNumber?: string | null;
}

export interface AidDistribution {
  id: number;
  clientId: number;
  distributionMonth: string;
  distributionDate: string;
  familyMaleCount: number;
  familyFemaleCount: number;
  familyTotalCount: number;
  oilLiters: number;
  flourKg: number;
  onionsKg: number;
  clothingSupport: boolean;
  clothingDetails?: string | null;
  cashAmount: number;
  healthInsuranceSponsorship: boolean;
  totalCashEquivalent: number;
  subCity: string;
  woreda: string;
  recordedBy?: string | null;
  signatureTaken: boolean;
  remark?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: AidDistributionClient;
}

export interface AidDistributionSummary {
  totalRecords: number;
  totalFamilyMale: number;
  totalFamilyFemale: number;
  totalFamilyMembers: number;
  totalOilLiters: number;
  totalFlourKg: number;
  totalOnionsKg: number;
  totalClothingCount: number;
  totalHealthInsuranceCount: number;
  totalCashAmount: number;
  totalCashEquivalent: number;
}

export interface CreateAidDistributionPayload {
  clientId: number;
  distributionMonth: string;
  distributionDate?: string;
  familyMaleCount?: number;
  familyFemaleCount?: number;
  familyTotalCount?: number;
  oilLiters?: number;
  flourKg?: number;
  onionsKg?: number;
  clothingSupport?: boolean;
  clothingDetails?: string;
  cashAmount?: number;
  healthInsuranceSponsorship?: boolean;
  totalCashEquivalent?: number;
  subCity?: string;
  woreda?: string;
  recordedBy?: string;
  signatureTaken?: boolean;
  remark?: string;
}

export interface QueryAidDistributionParams {
  subCity?: string;
  woreda?: string;
  distributionMonth?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AidDistributionListResponse {
  data: AidDistribution[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const createAidDistribution = async (
  payload: CreateAidDistributionPayload
): Promise<AidDistribution> => {
  const response = await axios.post(
    `${BASE_URL}/disability-elderly/aid-distributions`,
    payload,
    { headers: authHeader() }
  );
  return response.data;
};

export const listAidDistributions = async (
  params?: QueryAidDistributionParams
): Promise<AidDistributionListResponse> => {
  const response = await axios.get(
    `${BASE_URL}/disability-elderly/aid-distributions`,
    {
      headers: authHeader(),
      params,
    }
  );
  return response.data;
};

export const getAidDistributionSummary = async (
  params?: { subCity?: string; woreda?: string; distributionMonth?: string }
): Promise<AidDistributionSummary> => {
  const response = await axios.get(
    `${BASE_URL}/disability-elderly/aid-distributions/summary`,
    {
      headers: authHeader(),
      params,
    }
  );
  return response.data;
};

export const deleteAidDistribution = async (id: number): Promise<{ success: boolean }> => {
  const response = await axios.delete(
    `${BASE_URL}/disability-elderly/aid-distributions/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};
