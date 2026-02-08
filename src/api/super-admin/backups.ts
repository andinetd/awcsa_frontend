import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import { Backup } from "@/types/super-admin";

const getAuthHeader = () => {
  const { token } = useAuthStore.getState();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getBackups = async (): Promise<Backup[]> => {
  const res = await axios.get(`${BASE_URL}/admin/backups`, getAuthHeader());
  return res.data;
};

export const downloadBackup = async (filename: string) => {
  const { token } = useAuthStore.getState();
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/backups/download/${filename}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important for file download
      },
    );

    // Create a blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } catch (error) {
    console.error("Error downloading backup:", error);
    throw error;
  }
};
