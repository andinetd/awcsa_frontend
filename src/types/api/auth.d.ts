import { DeputyBureau } from "..";

// Employee JWT Payload
type EmployeeJwtPayload = {
  sub: number;
  user: {
    id: number;
    email: string;
    accountType: "EMPLOYEE";
  };
  entity: {
    type: "Employee";
    id: number;
    role: string;
  };
  auth: {
    permissions: string[];
  };
  orgUnit: {
    id: number;
    type: UnitType;
    deputyBureau: string | null;
  };
  iat?: number;
  exp?: number;
};

// Client JWT Payload
type ClientJwtPayload = {
  sub: number;
  user: {
    id: number;
    email: string;
    accountType: "CLIENT";
  };
  entity: {
    type: "Client";
    id: number;
  };
  auth: {
    permissions: string[];
  };
  iat?: number;
  exp?: number;
};

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
  recaptchaToken: string;
};

type JwtPayload = EmployeeJwtPayload | ClientJwtPayload;

type JwtUserType = {
  id: number;
  email: string;
  accountType: AccountType;
};

type UserType = {
  id: number;
  email: string;
  accountType: AccountType;
  entityId: number;
  role?: UserRole;
  permissions?: PermissionOperation[];
  entityType: string;
  failedLoginCount: number;
  status: string;
};

type ClientSignInResponse = {
  access_token: string;
  user: UserType;
};

type DeputyBureau =
  | "SUPER_ADMIN"
  | "BUREAU_HEAD"
  | "CHILDREN_AFFAIRS"
  | "SOCIAL_AFFAIRS"
  | "EDIR"
  | "WOMEN_AFFAIRS"
  | "CLIENT"
  | "CARE_CENTERS_PORTAL"
  | null;

type OrgType = {
  id?: number;
  type?: UnitType;
  deputyBureau?: string | null;
};

type UserRole =
  | "Bureau_Manager"
  | "DEPUTY_MANAGER"
  | "DIRECTOR"
  | "TEAM_LEADER"
  | "EXPERT"
  | "SOCIAL_WORKER"
  | "FACILITATOR_OFFICER";

type AccountType = "EMPLOYEE" | "CLIENT" | "CHILD_CARE_FACLITY";

enum PermissionOperation {
  READ,
  WRITE,
  DELETE,
  UPDATE,
}

enum UnitType {
  BUREAU = "BUREAU",
  OFFICE = "OFFICE",
  WOREDA = "WOREDA",
  SUBCITY = "SUBCITY",
}
