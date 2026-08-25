import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { MonitoringPayload } from "./technologySupport";

export interface WomenTrainingRecord {
  id: number;
  womenProfileId: number | null;
  firstName?: string | null;
  lastName?: string | null;
  trainingTopic: string;
  startDate: string;
  completionDate?: string;
  attended: boolean;
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

export interface TrainingPayload {
  womanId?: number;
  firstName?: string;
  lastName?: string;
  trainingTopic: string;
  startDate: string;
  completionDate?: string;
  attended?: boolean;
  remark?: string;
}

export interface UpdateTrainingPayload {
  trainingTopic?: string;
  startDate?: string;
  completionDate?: string;
  attended?: boolean;
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

export const getWomenTrainings = async () => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.get(`${BASE_URL}/women/training`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getTrainingById = async (id: number) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.get(`${BASE_URL}/women/training/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const registerWomenTraining = async (payload: TrainingPayload) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.post(`${BASE_URL}/women/training`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const updateTraining = async (payload: { id: number; data: UpdateTrainingPayload }) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.patch(`${BASE_URL}/women/training/${payload.id}`, payload.data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const deleteTraining = async (id: number) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.delete(`${BASE_URL}/women/training/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const addTrainingMonitoring = async (payload: { id: number; data: MonitoringPayload }) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.post(`${BASE_URL}/women/training/${payload.id}/monitoring`, payload.data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const getTrainingMonitoring = async (id: number) => {
  const { token } = useAuthStore.getState();
  const { data } = await axios.get(`${BASE_URL}/women/training/${id}/monitoring`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};