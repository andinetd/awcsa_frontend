import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import {
  Edir,
  EdirCouncil,
  EdirLevel,
  EdirCancellationReason,
  EdirStatus,
} from "./edir";

const getAuthHeaders = () => {
  const { token } = useAuthStore.getState();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getEdirCouncils = async (params?: {
  level?: EdirLevel;
  status?: EdirStatus | "ALL";
  subCity?: string;
}): Promise<EdirCouncil[]> => {
  const response = await axios.get(`${BASE_URL}/edir/councils`, {
    headers: getAuthHeaders(),
    params,
  });
  return response.data;
};

export const getEdirCouncilById = async (
  councilId: number
): Promise<EdirCouncil> => {
  const response = await axios.get(`${BASE_URL}/edir/councils/${councilId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export interface EdirCouncilPayload {
  name: string;
  level: EdirLevel;
  subCity: string;
  woreda?: string;
  kebele?: string;
  establishmentDate: string;
  chairpersonName?: string;
  chairpersonPhone?: string;
  contactPhone?: string;
  address?: string;
}

export const registerEdirCouncil = async (
  data: EdirCouncilPayload
): Promise<EdirCouncil> => {
  try {
    const response = await axios.post(`${BASE_URL}/edir/councils`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const updateEdirCouncil = async ({
  councilId,
  data,
}: {
  councilId: number;
  data: Partial<EdirCouncilPayload>;
}): Promise<EdirCouncil> => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/edir/councils/${councilId}`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const renewEdirCouncil = async ({
  councilId,
  year,
}: {
  councilId: number;
  year?: number;
}): Promise<EdirCouncil> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/edir/councils/${councilId}/renew`,
      { year },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const cancelEdirCouncil = async ({
  councilId,
  data,
}: {
  councilId: number;
  data: { reason: EdirCancellationReason; reasonDescription?: string };
}): Promise<EdirCouncil> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/edir/councils/${councilId}/cancel`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const addEdirsToCouncil = async ({
  councilId,
  associationIds,
}: {
  councilId: number;
  associationIds: number[];
}): Promise<EdirCouncil> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/edir/councils/${councilId}/members`,
      { associationIds },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const removeEdirFromCouncil = async ({
  councilId,
  associationId,
}: {
  councilId: number;
  associationId: number;
}): Promise<EdirCouncil> => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/edir/councils/${councilId}/members/${associationId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const getEdirsForCouncilSelection = async (
  level: EdirLevel
): Promise<Edir[]> => {
  const response = await axios.get(`${BASE_URL}/edir/associations`, {
    headers: getAuthHeaders(),
    params: { level, status: "ACTIVE" },
  });
  return response.data;
};