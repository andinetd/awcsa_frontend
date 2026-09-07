import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import {
  CreateEligibilityPayload,
  DecideEligibilityPayload,
  EligibilityAssessment,
} from "./types-v2";

const authHeader = () => ({
  Authorization: `Bearer ${useAuthStore.getState().token}`,
  "Content-Type": "application/json",
});

export const createEligibility = async (
  clientId: number,
  data: CreateEligibilityPayload
): Promise<EligibilityAssessment> => {
  const response = await axios.post(
    `${BASE_URL}/beneficiaries/eligibility/${clientId}`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};

export const decideEligibility = async (
  assessmentId: number,
  data: DecideEligibilityPayload
): Promise<EligibilityAssessment> => {
  const response = await axios.patch(
    `${BASE_URL}/beneficiaries/eligibility/${assessmentId}/decide`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};

export const listEligibility = async (): Promise<EligibilityAssessment[]> => {
  const response = await axios.get(
    `${BASE_URL}/beneficiaries/eligibility/list`,
    { headers: authHeader() }
  );
  return response.data;
};

export const listEligibilityForClient = async (
  clientId: number
): Promise<EligibilityAssessment[]> => {
  const response = await axios.get(
    `${BASE_URL}/beneficiaries/eligibility/client/${clientId}`,
    { headers: authHeader() }
  );
  return response.data;
};
