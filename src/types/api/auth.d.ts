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

type JwtPayload = {
  sub: number;
  iat: number;
  exp: number;
  user: UserType;
  org?: OrgType;
  auth?: { permissions: string[] };
};

type UserType = {
  id: number;
  email: string;
  accountType: "CLIENT" | "ADMIN" | "CHILD_CARE_FACILITY" ; 
  entityId: number;
  role?: UserRole;
  permissions?: PermissionOperation[];
  entityType: string;
  failedLoginCount: number;
  stauts: string; 
};

type ClientSignInResponse = {
  access_token: string;
  user: UserType;
  org?: OrgType;
};

type ClientSignInToken = {
  access_token: string;
  user: UserType;
  org?: OrgType;
};

type OrgType = {
  unitId: number;
  unitType: string;
  deputyBureau: string;
};

enum UserRole {
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
