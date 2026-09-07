import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import {
  Beneficiary,
  BeneficiarySearchParams,
  BeneficiarySearchResponse,
  CreateElderlyPayload,
  CreateDisabledPayload,
  UpdateBeneficiaryPayload,
  DashboardCounts,
  FaydaVerificationResult,
} from "./types-v2";

const authHeader = () => ({
  Authorization: `Bearer ${useAuthStore.getState().token}`,
  "Content-Type": "application/json",
});

export const registerElderlyBeneficiary = async (
  data: CreateElderlyPayload
): Promise<Beneficiary> => {
  const response = await axios.post(
    `${BASE_URL}/beneficiaries/elderly`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};

export const registerDisabledBeneficiary = async (
  data: CreateDisabledPayload
): Promise<Beneficiary> => {
  const response = await axios.post(
    `${BASE_URL}/beneficiaries/disabled`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};

export const searchBeneficiaries = async (
  params: BeneficiarySearchParams
): Promise<BeneficiarySearchResponse> => {
  const response = await axios.get(`${BASE_URL}/beneficiaries/search`, {
    params,
    headers: authHeader(),
  });
  return response.data;
};

export const getBeneficiaryByFayda = async (
  faydaId: string
): Promise<Beneficiary> => {
  const response = await axios.get(
    `${BASE_URL}/beneficiaries/fayda/${faydaId}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const verifyFayda = async (
  faydaId: string
): Promise<FaydaVerificationResult> => {
  const response = await axios.get(
    `${BASE_URL}/beneficiaries/verify-fayda/${faydaId}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const getBeneficiaryDashboard = async (): Promise<DashboardCounts> => {
  const response = await axios.get(`${BASE_URL}/beneficiaries/dashboard`, {
    headers: authHeader(),
  });
  return response.data;
};

export const updateBeneficiaryProfile = async (
  id: number,
  data: UpdateBeneficiaryPayload
): Promise<Beneficiary> => {
  const response = await axios.patch(
    `${BASE_URL}/beneficiaries/${id}`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};
