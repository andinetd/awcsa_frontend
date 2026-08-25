import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { MonitoringPayload } from "./technologySupport";

export interface WomenEmploymentRecord {
  id: number;
  womenProfileId: number | null;
  firstName?: string | null;
  lastName?: string | null;
  employmentType: "INDIVIDUAL" | "GROUP";
  sector: string;
  year: string;
  remark?: string;
  womenProfile?: {
    id: number;
    client: {
      id: number;
      firstName: string;
      lastName: string;
      cityIdNumber: string;
      phoneNumber: string;
      address: string;
    };
  };
  monitoringLogs?: MonitoringLog[];
  createdAt: string;
  updatedAt: string;
}

export interface EmploymentPayload {
  womanId?: number;
  firstName?: string;
  lastName?: string;
  employmentType: "INDIVIDUAL" | "GROUP";
  sector: string;
  year: string;
  remark?: string;
}

export interface UpdateEmploymentPayload {
  employmentType?: "INDIVIDUAL" | "GROUP";
  sector?: string;
  year?: string;
  remark?: string;
}

export interface MonitoringLog {
  id: number;
  monitoringDate: string;
  assessedBy: string;
  currentStatus: string;
  score: number;
  remark?: string;
  createdAt: string;
}

export const getWomenEmployments = async () => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.get(`${BASE_URL}/women/employment`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getEmploymentById = async (id: number) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.get(`${BASE_URL}/women/employment/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const registerWomenEmployment = async (payload: EmploymentPayload) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.post(`${BASE_URL}/women/employment`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const updateEmployment = async (payload: { id: number; data: UpdateEmploymentPayload }) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.patch(`${BASE_URL}/women/employment/${payload.id}`, payload.data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const deleteEmployment = async (id: number) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.delete(`${BASE_URL}/women/employment/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const addEmploymentMonitoring = async (payload: { id: number; data: MonitoringPayload }) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.post(`${BASE_URL}/women/employment/${payload.id}/monitoring`, payload.data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const getEmploymentMonitoring = async (id: number) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.get(`${BASE_URL}/women/employment/${id}/monitoring`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};