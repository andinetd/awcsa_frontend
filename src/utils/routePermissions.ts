type RouteGuard = {
  allowedAccountTypes: ("EMPLOYEE" | "CLIENT")[];
  allowedRoles?: string[];
};

export const routePermissions: Record<string, RouteGuard> = {
  "/register": { allowedAccountTypes: ["CLIENT"] },
  "/applicant-portal": { allowedAccountTypes: ["CLIENT"] },

  "/bureau-head": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["Bureau_Manager", "DIRECTOR"],
  },
  "/super-admin/general-settings": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["EXPERT", "Bureau_Manager"],
  },
  "/super-admin/user-management": {
    allowedAccountTypes: ["EMPLOYEE"],
    allowedRoles: ["DIRECTOR", "Bureau_Manager"],
  },

  "/social-affairs/socials/dashboard": { allowedAccountTypes: ["EMPLOYEE"] },
  "/adoption/dashboard": { allowedAccountTypes: ["EMPLOYEE"] },
};
