import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export interface WoredaRef {
  id: number;
  code: string;
  subCityId: number;
}

export interface SubCityRef {
  id: number;
  name: string;
  order: number;
  woredas: WoredaRef[];
}

const getAuthHeaders = () => {
  const { token } = useAuthStore.getState();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getSubCities = async (): Promise<SubCityRef[]> => {
  const response = await axios.get(`${BASE_URL}/edir/sub-cities`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};