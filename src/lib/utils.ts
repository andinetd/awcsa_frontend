import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { EmployeeRole } from "@/types/employee"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRole(role: EmployeeRole | string) {
  switch (role) {
    case EmployeeRole.BUREAU_MANAGER:
      return "Bureau Manager";
    case EmployeeRole.DIRECTOR:
      return "Director";
    case EmployeeRole.EXPERT:
      return "Expert";
    case EmployeeRole.SOCIAL_WORKER:
      return "Social Worker";
    case EmployeeRole.FACILITATOR_OFFICER:
      return "Facilitator Officer";
    default:
      // Fallback for unknown or string roles
      return (
        (typeof role === "string" &&
          role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())) ||
        String(role)
      );
  }
}

export interface RegisterEmployeeDto {
  cityIdNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: EmployeeRole;
  OrganizationUnitId: number;
  activeStatus: boolean;
}


