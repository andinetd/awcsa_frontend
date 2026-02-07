import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import {
  SupportServicePayload,
  ServiceCategory,
  ServiceFrequency,
} from "./types";

export interface ServiceTypeDefinition {
  id: number;
  name: string;
  category: ServiceCategory;
  frequency: ServiceFrequency;
}

export const SERVICE_TYPES: ServiceTypeDefinition[] = [
  {
    id: 1,
    name: "Startup Capital Support",
    category: "FINANCIAL",
    frequency: "ONE_TIME",
  },
  {
    id: 2,
    name: "Monthly Financial Subsidy",
    category: "FINANCIAL",
    frequency: "RECURRING_MONTHLY",
  },
  {
    id: 3,
    name: "Emergency Medical Fund",
    category: "FINANCIAL",
    frequency: "AS_NEEDED",
  },
  {
    id: 4,
    name: "Food & Nutrition Support",
    category: "SUPPLIES",
    frequency: "RECURRING_MONTHLY",
  },
  {
    id: 5,
    name: "School Uniform & Material Support",
    category: "SUPPLIES",
    frequency: "RECURRING_YEARLY",
  },
  {
    id: 6,
    name: "Sanitary Supplies",
    category: "SUPPLIES",
    frequency: "RECURRING_MONTHLY",
  },
  {
    id: 7,
    name: "Skill Development Training",
    category: "TRAINING",
    frequency: "ONE_TIME",
  },
  {
    id: 8,
    name: "Legal Counseling",
    category: "LEGAL",
    frequency: "AS_NEEDED",
  },
  {
    id: 9,
    name: "Psychosocial Counseling",
    category: "COUNSELING",
    frequency: "AS_NEEDED",
  },
  {
    id: 10,
    name: "Temporary Shelter",
    category: "SHELTER",
    frequency: "AS_NEEDED",
  },
  {
    id: 11,
    name: "Medical Checkup & Treatment",
    category: "MEDICAL",
    frequency: "AS_NEEDED",
  },
  {
    id: 12,
    name: "Health Insurance Coverage",
    category: "MEDICAL",
    frequency: "RECURRING_YEARLY",
  },
  {
    id: 13,
    name: "Public Transport Pass",
    category: "FINANCIAL",
    frequency: "RECURRING_MONTHLY",
  },
  {
    id: 14,
    name: "Disability Financial Grant",
    category: "FINANCIAL",
    frequency: "RECURRING_MONTHLY",
  },
  {
    id: 15,
    name: "Mobility Device Supply",
    category: "SUPPLIES",
    frequency: "AS_NEEDED",
  },
];

export const getSupportServices = async (cityId?: string) => {
  const { token } = useAuthStore.getState();
  const url = `${BASE_URL}/disability-elderly/history/support`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: cityId ? { cityId } : undefined,
    });

    return response.data.map((item: any) => {
      const def = SERVICE_TYPES.find((t) => t.id === item.serviceTypeId);
      return {
        ...item,
        serviceName: def?.name || `Service #${item.serviceTypeId}`,
        category: def?.category,
        frequency: def?.frequency,
      };
    });
  } catch (error: any) {
    console.warn("Fetch services failed", error);
    return [];
  }
};

export const registerSupportService = async (data: SupportServicePayload) => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.post(
      `${BASE_URL}/disability-elderly/support`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to register support service",
    );
  }
};
