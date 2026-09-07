import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import {
  AuditLog,
  AuditLogFilters,
  AuditLogResponse,
} from "@/types/super-admin";

const getAuthHeader = () => {
  const { token } = useAuthStore.getState();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAuditLogs = async (
  filters?: AuditLogFilters,
): Promise<AuditLogResponse> => {
  const queryParams = new URLSearchParams();

  if (filters) {
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());
    if (filters.userId) queryParams.append("userId", filters.userId.toString());
    if (filters.entityType)
      queryParams.append("entityType", filters.entityType);
    if (filters.entityId !== undefined)
      queryParams.append("entityId", filters.entityId.toString());
    if (filters.action) queryParams.append("action", filters.action);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);
  }

  const res = await axios.get(
    `${BASE_URL}/audit-logs?${queryParams.toString()}`,
    getAuthHeader(),
  );
  return res.data;
};

export const getAuditLogDetails = async (id: number): Promise<AuditLog> => {
  const res = await axios.get(`${BASE_URL}/audit-logs/${id}`, getAuthHeader());
  return res.data;
};
