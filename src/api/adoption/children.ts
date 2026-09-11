import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import { Child } from "@/types/child-matching-types";
import axios from "axios";

export const getChildren = async (): Promise<Child[]> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/adoption/child`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resp = res.data;

  if (Array.isArray(resp)) {
    return resp;
  } else if (resp?.data && Array.isArray(resp.data)) {
    return resp.data;
  } else if (resp?.content && Array.isArray(resp.content)) {
    return resp.content;
  } else if (resp?.children && Array.isArray(resp.children)) {
    return resp.children;
  }

  return [];
};

export const getChildById = async (id: number): Promise<Child> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/adoption/child/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export interface TransferChildStatusPayload {
  newStatus: string;
  reasonForTransfer?: string;
  childCareFacilityId?: number;
  childIdFromFacility?: string;
  custodianId?: number;
  custodianDetails?: Record<string, any>;
  additionalNotes?: string;
}

export const transferChildStatus = async (
  childId: number,
  payload: TransferChildStatusPayload
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.patch(
    `${BASE_URL}/adoption/child/status/${childId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
