import { PermissionType } from "@/utils/permission";
import type { DeputyBureauModule } from "@/hooks/useCurrentRole";

export type AccountType = "CLIENT" | "EMPLOYEE";

export type DeputyBureau =
  | "SUPER_ADMIN"
  | "BUREAU_HEAD"
  | "CHILDREN_AFFAIRS"
  | "SOCIAL_AFFAIRS"
  | "EDIR"
  | "WOMEN_AFFAIRS"
  | "CLIENT";

export type AppModules =
  | "super-admin"
  | "bureau-head"
  | "adoption"
  | "social-affairs"
  | "womens"
  | "edir"
  | "elderly-disabled";

export type OrgType = {
  unitId: string;
  unitType: "BUREAU" | "SUB_CITY" | "WOREDA";
  deputyBureau: DeputyBureau;
};

export type User = {
  id: String;
  email: String;
  accountType: AccountType;

  role: AppModules;
  permissions: PermissionType[];

  // Organizational hierarchy
  org: OrgType;
};
