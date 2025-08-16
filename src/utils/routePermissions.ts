type RouteGuard = {
  allowedAccountTypes: ("EMPLOYEE" | "CLIENT")[];
  allowedRoles?: string[]; // Optional role restriction for EMPLOYEE
};

const routePermissions: Record<string, RouteGuard> = {
  "/adoption/register": { allowedAccountTypes: ["CLIENT"] },
  "/adoption/applicant-portal": { allowedAccountTypes: ["CLIENT"]},

  "/bureau-head": { allowedAccountTypes: ["EMPLOYEE"], allowedRoles: ["BUREAU_MANAGER", "DIRECTOR"] },
  "/super-admin/general-settings": { allowedAccountTypes: ["EMPLOYEE"], allowedRoles: ["DIRECTOR"] },
  "/super-admin/user-management": { allowedAccountTypes: ["EMPLOYEE"], allowedRoles: ["DIRECTOR"] },

  "/social-affairs/dashboard": { allowedAccountTypes: ["EMPLOYEE"] },
};
