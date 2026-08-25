import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export interface TechnologySupportRecord {
  id: number;
  womenProfileId: number | null;
  firstName?: string | null;
  lastName?: string | null;
  technologyType: string;
  associationName?: string;
  isPoor: boolean;
  isSexWorker: boolean;
  disabilities: string[];
  healthConditions: string[];
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

export interface MonitoringLog {
  id: number;
  monitoringDate: string;
  assessedBy: string;
  currentStatus: string;
  score: number;
  remark?: string;
  createdAt: string;
}

export interface MonitoringPayload {
  monitoringDate: string;
  assessedBy: string;
  currentStatus: string;
  score: number;
  remark?: string;
}

export const getTechnologySupport = async () => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.get(`${BASE_URL}/women/technology-support`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getTechnologySupportById = async (id: number) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.get(`${BASE_URL}/women/technology-support/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const registerTechnologySupport = async (payload: {
  womanId?: number;
  firstName?: string;
  lastName?: string;
  technologyType: string;
  associationName?: string;
  isPoor?: boolean;
  isSexWorker?: boolean;
  disabilities?: string[];
  healthConditions?: string[];
}) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.post(`${BASE_URL}/women/technology-support`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const updateTechnologySupport = async (payload: {
  id: number;
  data: Partial<{
    technologyType: string;
    associationName: string;
    isPoor: boolean;
    isSexWorker: boolean;
    disabilities: string[];
    healthConditions: string[];
  }>;
}) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.patch(`${BASE_URL}/women/technology-support/${payload.id}`, payload.data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const deleteTechnologySupport = async (id: number) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.delete(`${BASE_URL}/women/technology-support/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const addTechnologySupportMonitoring = async (payload: {
  id: number;
  data: MonitoringPayload;
}) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.post(
    `${BASE_URL}/women/technology-support/${payload.id}/monitoring`,
    payload.data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  return data;
};

export const getTechnologySupportMonitoring = async (id: number) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.get(`${BASE_URL}/women/technology-support/${id}/monitoring`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};