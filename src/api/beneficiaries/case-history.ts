import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import {
  CaseHistoryResponse,
  CreateDocumentPayload,
  CreateCaseNotePayload,
  BeneficiaryDocument,
  CaseNote,
} from "./types-v2";

const authHeader = () => ({
  Authorization: `Bearer ${useAuthStore.getState().token}`,
  "Content-Type": "application/json",
});

export const getCaseHistory = async (
  clientId: number
): Promise<CaseHistoryResponse> => {
  const response = await axios.get(
    `${BASE_URL}/beneficiaries/case-history/${clientId}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const listBeneficiaryDocuments = async (
  clientId: number
): Promise<BeneficiaryDocument[]> => {
  const response = await axios.get(
    `${BASE_URL}/beneficiaries/case-history/${clientId}/documents`,
    { headers: authHeader() }
  );
  return response.data;
};

export const uploadBeneficiaryDocument = async (
  clientId: number,
  data: CreateDocumentPayload
): Promise<BeneficiaryDocument> => {
  const response = await axios.post(
    `${BASE_URL}/beneficiaries/case-history/${clientId}/documents`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};

export const listCaseNotes = async (
  clientId: number
): Promise<CaseNote[]> => {
  const response = await axios.get(
    `${BASE_URL}/beneficiaries/case-history/${clientId}/notes`,
    { headers: authHeader() }
  );
  return response.data;
};

export const addCaseNote = async (
  clientId: number,
  data: CreateCaseNotePayload
): Promise<CaseNote> => {
  const response = await axios.post(
    `${BASE_URL}/beneficiaries/case-history/${clientId}/notes`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};
