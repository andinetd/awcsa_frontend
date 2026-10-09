import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export interface DuplicateCheckResult {
  found: boolean;
  client?: {
    id: number;
    firstName: string;
    lastName: string;
    grandfatherName: string | null;
    cityIdNumber: string | null;
    faydaId: string | null;
    phoneNumber: string | null;
    profiles: {
      hasWomenProfile: boolean;
      hasDisabilityProfile: boolean;
      hasElderlyProfile: boolean;
    };
  };
}

export interface StandardizedSupportItem {
  id: number;
  sourceModule: 'WOMEN_AFFAIRS' | 'DISABILITY_ELDERLY' | 'GENERAL_SUPPORT';
  serviceName: string;
  category: 'FINANCIAL' | 'SUPPLIES' | 'SHELTER' | 'MEDICAL' | 'TRAINING' | 'LEGAL';
  exactDetails: {
    amountOrQuantity: string;
    frequency?: string;
    periodCovered?: string | null;
  };
  disbursedBy: {
    office: string;
    provider: string;
    dateProvided: string;
    daysAgo: number;
  };
  status: string;
}

export interface ActiveSupportsResponse {
  clientId: number;
  beneficiaryName: string;
  cityIdNumber: string | null;
  faydaId: string | null;
  totalAssistanceCount: number;
  activeSupports: StandardizedSupportItem[];
}

export const checkClientDuplicate = async (params: {
  cityIdNumber?: string;
  faydaId?: string;
}): Promise<DuplicateCheckResult> => {
  const { token } = useAuthStore.getState();
  const queryParams = new URLSearchParams();
  if (params.cityIdNumber) queryParams.set("cityIdNumber", params.cityIdNumber);
  if (params.faydaId) queryParams.set("faydaId", params.faydaId);

  const res = await axios.get(`${BASE_URL}/clients/check-duplicate?${queryParams.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getClientActiveSupports = async (
  clientId: number
): Promise<ActiveSupportsResponse> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/clients/${clientId}/active-supports`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
