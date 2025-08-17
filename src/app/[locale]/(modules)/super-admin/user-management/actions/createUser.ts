import axios from "axios";
import { RegisterEmployeeDto } from "@/types/employee";

export interface CreateUserPayload extends RegisterEmployeeDto {}

export async function createUser(payload: CreateUserPayload) {
  const roleMap: Record<string, number> = {
    BUREAU_MANAGER: 1,
    DIRECTOR: 2,
    EXPERT: 3,
    SOCIAL_WORKER: 4,
    FACILITATOR_OFFICER: 5,
  };
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = `${baseUrl}/admin/employees`;
  console.log("API endpoint:", endpoint);
  // Convert role string to roleId if present
  let sendPayload = { ...payload };
  if (sendPayload.role && typeof sendPayload.role === "string") {
    sendPayload = {
      ...sendPayload,
      roleId: roleMap[sendPayload.role],
    };
    delete sendPayload.role;
  }
  if ("activeStatus" in sendPayload) {
    delete sendPayload.activeStatus;
  }
  try {
    console.log("Sending payload:", sendPayload);
    const response = await axios.post(endpoint, sendPayload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
