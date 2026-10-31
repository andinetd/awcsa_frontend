import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import {
  Edir,
  EdirCancellationReason,
  EdirDocument,
  EdirDocumentType,
} from "./edir";

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

export const uploadEdirDocument = async (
  fileOrParams:
    | File
    | {
        file: File;
        type?: EdirDocumentType;
        edirAssociationId?: number;
        description?: string;
      },
  defaultType: EdirDocumentType = "BY_LAWS"
): Promise<EdirDocument> => {
  const { token } = useAuthStore.getState();
  const formData = new FormData();

  if (fileOrParams instanceof File) {
    formData.append("file", fileOrParams);
    formData.append("type", defaultType);
  } else {
    formData.append("file", fileOrParams.file);
    formData.append("type", fileOrParams.type || defaultType);
    if (fileOrParams.edirAssociationId) {
      formData.append(
        "edirAssociationId",
        fileOrParams.edirAssociationId.toString()
      );
    }
    if (fileOrParams.description) {
      formData.append("description", fileOrParams.description);
    }
  }

  try {
    const response = await axios.post(`${BASE_URL}/edir/documents`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to upload document";
    throw new Error(message);
  }
};

export const downloadEdirDocument = async (id: number): Promise<string> => {
  const { token } = useAuthStore.getState();
  const response = await axios.get(`${BASE_URL}/edir/documents/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
  return URL.createObjectURL(response.data);
};