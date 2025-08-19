"use client";

import { useAuthStore } from "@/stores/auth-store";
import { AppModules, DeputyBureau } from "@/types";
import { EmployeeRole } from "@/types/employee";
export function useCurrentRole() {
  const { user } = useAuthStore();

  if (!user?.role) return undefined;
  console.log("USER IN useCurrentRole: ", JSON.stringify(user));

  return user?.role;
}

export function useEmployeModule(): DeputyBureau | undefined {

  const { org } = useAuthStore();
  return org?.deputyBureau as DeputyBureau;
}
