"use client";

import { useAuthStore } from "@/stores/auth-store";
import { DeputyBureau } from "@/types/api/auth";
import { EmployeeRole } from "@/types/super-admin";
export function useCurrentRole() {
  const { userRole } = useAuthStore();

  if (!userRole) return undefined;

  return userRole;
}

export function useEmployeModule(): DeputyBureau | undefined {
  const { orgUnit } = useAuthStore();
  return orgUnit?.deputyBureau as DeputyBureau;
}
