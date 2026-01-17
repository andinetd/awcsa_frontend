import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { TrainingPayload, TrainingRecord } from "./types";

export const getTrainings = async (clientId?: number) => {
  const { token } = useAuthStore.getState();
  const url = clientId
    ? `${BASE_URL}/beneficiaries/training/${clientId}`
    : `${BASE_URL}/beneficiaries/training`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch training records"
    );
  }
};

export const registerTraining = async (data: TrainingPayload) => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.post(
      `${BASE_URL}/beneficiaries/training`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to register training"
    );
  }
};
