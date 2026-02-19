import { DeputyBureau } from "@/types/api/auth";

type RouteGuard = {
  allowedAccountTypes: (
    | "EMPLOYEE"
    | "CLIENT"
    | "CHILD_CARE_FACLITY"
    | "CHILD_CARE_FACILITY"
  )[];
  allowedRoles?: DeputyBureau[];
};

export const routePermissions: Record<string, RouteGuard> = {
  "/applicant-portal": { allowedAccountTypes: ["CLIENT"] },
  "/care-centers-portal": {
    allowedAccountTypes: ["CHILD_CARE_FACLITY", "EMPLOYEE"],
    allowedRoles: ["SYSTEM", "CHILDREN_AFFAIRS"],
  },

  "/bureau-head": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM"],
  },
  "/super-admin": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM"],
  },
  "/social-affairs": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "SOCIAL_AFFAIRS", "EDIR"],
  },
  "/womens": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "WOMEN_AFFAIRS"],
  },
  "/adoption": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM", "CHILDREN_AFFAIRS"],
  },
  "/complaints": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["SYSTEM"],
  },
};
