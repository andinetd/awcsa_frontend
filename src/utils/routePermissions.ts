import { DeputyBureau } from "@/types/api/auth";

type RouteGuard = {
  allowedAccountTypes: ("EMPLOYEE" | "CLIENT")[];
  allowedRoles?: DeputyBureau[];
};

export const routePermissions: Record<string, RouteGuard> = {
  "/register": { allowedAccountTypes: ["CLIENT"] },
  "/applicant-portal": { allowedAccountTypes: ["CLIENT"] },

  "/bureau-head": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["BUREAU_HEAD"],
  },
  "/super-admin/general-settings": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["BUREAU_HEAD", "SUPER_ADMIN"],
  },
  "/super-admin/user-management": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["BUREAU_HEAD", "SUPER_ADMIN"],
  },

  "/social-affairs/socials/dashboard": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["BUREAU_HEAD"],
  },
  "/adoption/dashboard": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["CHILDREN_AFFAIRS"],
  },
};
