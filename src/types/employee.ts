export enum EmployeeRole {
  BUREAU_MANAGER = "BUREAU_MANAGER",
  DIRECTOR = "DIRECTOR",
  EXPERT = "EXPERT",
  SOCIAL_WORKER = "SOCIAL_WORKER",
  FACILITATOR_OFFICER = "FACILITATOR_OFFICER",
}

export interface RegisterEmployeeDto {
  cityIdNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role?: EmployeeRole;
  roleId?: number;
  OrganizationUnitId: number;
  activeStatus?: boolean;
}
