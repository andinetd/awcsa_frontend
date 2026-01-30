import { DeputyBureau } from "@/types/api/auth";

type RouteGuard = {
  allowedAccountTypes: ("EMPLOYEE" | "CLIENT" | "CHILD_CARE_FACLITY")[];
  allowedRoles?: DeputyBureau[];
};

export const routePermissions: Record<string, RouteGuard> = {
  "/applicant-portal": { allowedAccountTypes: ["CLIENT"] },
  "/complaints": { allowedAccountTypes: ["CLIENT"] },
  "/care-centers-portal": {
    allowedAccountTypes: ["CHILD_CARE_FACLITY", "EMPLOYEE"],
  },

  "/bureau-head": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["BUREAU_HEAD"],
  },
  "/super-admin": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["BUREAU_HEAD", "SUPER_ADMIN"],
  },
  "/social-affairs": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["BUREAU_HEAD", "SOCIAL_AFFAIRS", "EDIR"],
  },
  "/womens": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["BUREAU_HEAD", "WOMEN_AFFAIRS"],
  },
  "/adoption": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["BUREAU_HEAD"], // TODO: Add children affairs, removed "CHILDREN_AFFAIRS" because care centers are considered as children affairs
  },
};
