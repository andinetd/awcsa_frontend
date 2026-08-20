import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { Edir, EdirCancellationReason, EdirDocument } from "./edir";

const getAuthHeaders = () => {
  const { token } = useAuthStore.getState();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const renewEdirAssociation = async ({
  id,
  year,
}: {
  id: number;
  year?: number;
}): Promise<Edir> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/edir/associations/${id}/renew`,
      { year },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const cancelEdirAssociation = async ({
  id,
  data,
}: {
  id: number;
  data: { reason: EdirCancellationReason; reasonDescription?: string };
}): Promise<Edir> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/edir/associations/${id}/cancel`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const reissueEdirCertificate = async (id: number): Promise<Edir> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/edir/associations/${id}/certificate/reissue`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const uploadEdirDocument = async (file: File): Promise<EdirDocument> => {
  const { token } = useAuthStore.getState();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "BY_LAWS");

  const response = await axios.post(`${BASE_URL}/edir/documents`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const downloadEdirDocument = async (id: number): Promise<string> => {
  const { token } = useAuthStore.getState();
  const response = await axios.get(`${BASE_URL}/edir/documents/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
  return URL.createObjectURL(response.data);
};