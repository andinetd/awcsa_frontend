import { DeputyBureau } from "..";

type ClientSignup = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cityIdNumber: string;
  email: string;
  password: string;
};

type ClientSignIn = {
  email: string;
  password: string;
};

type LoginResponseUser = {
  id: number;
  email: string;
  accountType: "CLIENT" | "ADMIN" | "CHILD_CARE_FACILITY" | string; // expand if needed
  entityId: number;
  role?: EmployeeRole;
  permissions?: PermissionOperation;
  entityType: string;
  failedLoginCount: number;
  stauts: string; // maybe typo? probably "status"
};

type ClientSignInResponse = {
  access_token: string;
  user: LoginResponseUser;
  org?: OrgType;
};

type ClientSignInToken = {
  access_token: string;
  user: LoginResponseUser;
  org?: OrgType;
};

type OrgType = {
  unitId: number;
  unitType: string;
  deputyBureau: string;
};

enum EmployeeRole {
  BUREAU_MANAGER,
  DEPUTY_MANAGER,
  DIRECTOR,
  TEAM_LEADER,
  EXPERT,
  SOCIAL_WORKER,
  FACILITATOR_OFFICER,
}

enum PermissionOperation {
  READ,
  WRITE,
  DELETE,
  UPDATE,
}
