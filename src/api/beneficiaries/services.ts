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
    name: "Public Transport Pass",
    category: "FINANCIAL",
    frequency: "RECURRING_MONTHLY",
  },
  {
    id: 5,
    name: "Disability Financial Grant",
    category: "FINANCIAL",
    frequency: "RECURRING_MONTHLY",
  },
  {
    id: 6,
    name: "Elderly Financial Support",
    category: "FINANCIAL",
    frequency: "RECURRING_MONTHLY",
  },
  {
    id: 7,
    name: "Food & Nutrition Support",
    category: "SUPPLIES",
    frequency: "RECURRING_MONTHLY",
  },
  {
    id: 8,
    name: "School Uniform & Material Support",
    category: "SUPPLIES",
    frequency: "RECURRING_YEARLY",
  },
  {
    id: 9,
    name: "Sanitary Supplies",
    category: "SUPPLIES",
    frequency: "RECURRING_MONTHLY",
  },
  {
    id: 10,
    name: "Mobility Device Supply",
    category: "SUPPLIES",
    frequency: "AS_NEEDED",
  },
  {
    id: 11,
    name: "Skill Development Training",
    category: "TRAINING",
    frequency: "ONE_TIME",
  },
  {
    id: 12,
    name: "Legal Counseling",
    category: "LEGAL",
    frequency: "AS_NEEDED",
  },
  {
    id: 13,
    name: "Psychosocial Counseling",
    category: "COUNSELING",
    frequency: "AS_NEEDED",
  },
  {
    id: 14,
    name: "Temporary Shelter",
    category: "SHELTER",
    frequency: "AS_NEEDED",
  },
  {
    id: 15,
    name: "Medical Checkup & Treatment",
    category: "MEDICAL",
    frequency: "AS_NEEDED",
  },
  {
    id: 16,
    name: "Health Insurance Coverage",
    category: "MEDICAL",
    frequency: "RECURRING_YEARLY",
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

    return (response.data || []).map((item: any) => {
      const backendType = item.serviceType;
      const def =
        SERVICE_TYPES.find((t) => t.id === item.serviceTypeId) ||
        SERVICE_TYPES.find(
          (t) =>
            t.name.toLowerCase() === backendType?.name?.toLowerCase(),
        );

      const serviceName =
        backendType?.name || def?.name || `Service #${item.serviceTypeId}`;
      const category = backendType?.category || def?.category || "OTHER";
      const frequency = backendType?.frequency || def?.frequency || "AS_NEEDED";

      return {
        ...item,
        serviceName,
        category,
        frequency,
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
