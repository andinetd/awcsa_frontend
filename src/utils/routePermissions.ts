import { DeputyBureau } from "@/types/api/auth";

type RouteGuard = {
  allowedAccountTypes: (
    | "EMPLOYEE"
    | "CLIENT"
    | "CHILD_CARE_FACLITY"
    | "CHILD_CARE_FACILITY"
  )[];
  allowedRoles?: DeputyBureau[];
  requiredPermissions?: string[];
};

export const routePermissions: Record<string, RouteGuard> = {
  "/applicant-portal": { allowedAccountTypes: ["CLIENT"] },
  "/care-centers-portal": {
    allowedAccountTypes: ["CHILD_CARE_FACLITY", "CHILD_CARE_FACILITY", "EMPLOYEE"],
    allowedRoles: ["SYSTEM", "CHILDREN_AFFAIRS", "CARE_CENTERS_PORTAL"],
  },

  "/bureau-head": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "BUREAU_HEAD"],
  },
  "/super-admin": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "SUPER_ADMIN"],
  },
  "/social-affairs/edir": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "EDIR"],
  },
  "/social-affairs/elderly-and-disabled": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "SOCIAL_AFFAIRS"],
  },
  "/social-affairs/dashboard": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "SOCIAL_AFFAIRS"],
  },
  "/social-affairs": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "SOCIAL_AFFAIRS", "EDIR"],
  },
  "/women": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "WOMEN_AFFAIRS"],
  },
  "/adoption": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "CHILDREN_AFFAIRS"],
  },
  "/complaints": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "BUREAU_HEAD"],
  },
  "/persons": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM"],
    requiredPermissions: ["view_unified_history"],
  },
};
