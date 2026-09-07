import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import {
  CreateServiceRequestPayload,
  UpdateServiceStatusPayload,
  ConfirmServicePayload,
  ServiceRequest,
  ServiceType,
  ServiceStatus,
} from "./types-v2";

const authHeader = () => ({
  Authorization: `Bearer ${useAuthStore.getState().token}`,
  "Content-Type": "application/json",
});

export const createServiceRequest = async (
  clientId: number,
  data: CreateServiceRequestPayload
): Promise<ServiceRequest> => {
  const response = await axios.post(
    `${BASE_URL}/beneficiaries/services/${clientId}`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};

export const updateServiceStatus = async (
  id: number,
  data: UpdateServiceStatusPayload
): Promise<ServiceRequest> => {
  const response = await axios.patch(
    `${BASE_URL}/beneficiaries/services/${id}/status`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};

export const confirmServiceRequest = async (
  id: number,
  data: ConfirmServicePayload
): Promise<ServiceRequest> => {
  const response = await axios.post(
    `${BASE_URL}/beneficiaries/services/${id}/confirm`,
    data,
    { headers: authHeader() }
  );
  return response.data;
};

export const listServiceRequests = async (filters: {
  status?: ServiceStatus;
  serviceType?: ServiceType;
  subCity?: string;
  woreda?: string;
}): Promise<ServiceRequest[]> => {
  const response = await axios.get(
    `${BASE_URL}/beneficiaries/services/list`,
    { params: filters, headers: authHeader() }
  );
  return response.data;
};

export const getServiceRequest = async (
  id: number
): Promise<ServiceRequest> => {
  const response = await axios.get(
    `${BASE_URL}/beneficiaries/services/${id}`,
    { headers: authHeader() }
  );
  return response.data;
};

export const listServiceRequestsForClient = async (
  clientId: number
): Promise<ServiceRequest[]> => {
  const response = await axios.get(
    `${BASE_URL}/beneficiaries/services/client/${clientId}`,
    { headers: authHeader() }
  );
  return response.data;
};
