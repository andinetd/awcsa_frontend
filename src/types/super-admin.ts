export interface Employee {
  firstName: string;
  lastName: string;
  role: {
    name: string;
  };
  orgUnit: {
    name: string;
    type: string;
  };
}

export interface User {
  id: number;
  email: string;
  status: "ACTIVE" | "INACTIVE" | "LOCKED" | "SUSPENDED"; // Assuming other statuses based on standard conventions
  employee: Employee;
}

export type EmployeeRole =
  | "BUREAU_MANAGER"
  | "DEPUTY_MANAGER"
  | "DIRECTOR"
  | "TEAM_LEADER"
  | "EXPERT"
  | "SOCIAL_WORKER"
  | "FACILITATOR_OFFICER";

export type Department =
  | "CHILDREN_AFFAIRS"
  | "WOMEN_AFFAIRS"
  | "SOCIAL_AFFAIRS"
  | "SYSTEM";

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  cityIdNumber: string;
  phoneNumber: string;
  email: string;
  password: string;
  roleId: number;
  orgUnitId: number;
  employeeRole: EmployeeRole;
  department: Department;
  directorateId?: number; // Optional based on hierarchy
  teamId?: number; // Optional based on hierarchy
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isSystemRole?: boolean;
  createdAt: string;
  updatedAt: string;
  assignedPermissions?: {
    id: number;
    name: string;
    resource: string;
    action: string;
  }[];
}

export interface CreateRoleDto {
  name: string;
  description: string;
}

export interface Permission {
  id: number;
  name: string;
  resourceType: string;
  operation: "READ" | "WRITE" | "UPDATE" | "DELETE" | "MANAGE";
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrgUnit {
  id: number;
  name: string;
  type: "BUREAU" | "SUB_CITY" | "WOREDA" | "OFFICE";
  description?: string;
  parentId: number | null;
  subCity?: string | null;
  woreda?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Directorate {
  id: number;
  name: string;
  deputyBureau: string;
  description: string;
  orgUnitId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  directorateId: number;
  orgUnitId: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  roles: Role[];
  structure: {
    bureaus: OrgUnit[];
    subCities: OrgUnit[];
    woredas: OrgUnit[];
  };
  directorates: Directorate[];
  teams: Team[];
}

export interface AuditLogUser {
  email: string;
  employee: {
    firstName: string;
    lastName: string;
  };
}

export interface AuditLog {
  id: number;
  userAccountId: number;
  employeeId: number | null;
  action: string;
  entityType: string;
  entityId: number;
  oldValue: any | null;
  newValue: any | null;
  remark: string;
  createdAt: string;
  updatedAt: string;
  user: AuditLogUser;
}

export interface AuditLogResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: AuditLog[];
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  userId?: number;
  entityType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export interface Backup {
  filename: string;
  size: number;
}
