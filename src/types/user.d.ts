import { PermissionType } from "@/utils/permission";
import type { UserRole } from "@/hooks/useCurrentRole";
export type UserType = {
  id: String;
  email: String;
  accountType: String;
  // EMPLOYEE or CLIENT

  role: String;
  permissions: PermissionType[];

  // Organizational hierarchy
  org: {
    unitId: 5;
    unitType: "BUREAU";
    deputyBureau: "CHILDREN_AFFAIRS";
  };
};
