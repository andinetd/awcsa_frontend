import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

export const importEdirMembers = async (file: File) => {
  const { token } = useAuthStore.getState();
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${BASE_URL}/edir/reports/import/members`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};
