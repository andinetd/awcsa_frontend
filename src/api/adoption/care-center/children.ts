import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

// to be updated
export interface CareCenterChild {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dob: string;
  foundDate: string;
}

export const getCareCenterChildren = async (
  facilityId: number
): Promise<CareCenterChild[]> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(
    `${BASE_URL}/care-center/${facilityId}/children`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
