import { UserRole } from "@/types/api/auth";

type RouteGuard = {
  allowedAccountTypes: ("EMPLOYEE" | "CLIENT")[];
  allowedRoles?: UserRole[]; 
};

export const routePermissions: Record<string, RouteGuard> = {
  "/adoption/register": { allowedAccountTypes: ["CLIENT"] },
  "/adoption/applicant-portal": { allowedAccountTypes: ["CLIENT"]},

  "/bureau-head": { allowedAccountTypes: ["EMPLOYEE"], allowedRoles: ["Bureau_Manager", "DIRECTOR"] },
  "/super-admin/general-settings": { allowedAccountTypes: ["EMPLOYEE"], allowedRoles: ["DIRECTOR"] },
  "/super-admin/user-management": { allowedAccountTypes: ["EMPLOYEE"], allowedRoles: ["DIRECTOR", "Bureau_Manager"] },

  "/social-affairs/dashboard": { allowedAccountTypes: ["EMPLOYEE"] },
};
