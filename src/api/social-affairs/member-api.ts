import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import {
  CreateEdirMemberPayload,
  EdirMember,
  UpdateEdirMemberPayload,
} from "./member-types";

const getAuthHeaders = () => {
  const { token } = useAuthStore.getState();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getEdirMembers = async (
  associationId: number
): Promise<EdirMember[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/edir/members/association/${associationId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const addEdirMember = async (
  data: CreateEdirMemberPayload
): Promise<EdirMember> => {
  try {
    const response = await axios.post(`${BASE_URL}/edir/members`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const getEdirMemberById = async (id: number): Promise<EdirMember> => {
  try {
    const response = await axios.get(`${BASE_URL}/edir/members/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const updateEdirMember = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateEdirMemberPayload;
}): Promise<EdirMember> => {
  try {
    const response = await axios.patch(`${BASE_URL}/edir/members/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};
