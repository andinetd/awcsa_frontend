export enum ComplaintCategory {
  PROCESS_DELAY = "PROCESS_DELAY",
  STAFF_BEHAVIOR = "STAFF_BEHAVIOR",
  DOCUMENTATION_ISSUE = "DOCUMENTATION_ISSUE",
  SYSTEM_ERROR = "SYSTEM_ERROR",
  OTHER = "OTHER",
}

export enum ComplaintStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export interface Complaint {
  id: string;
  subject: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  submittedById: number;
  handledById?: number | null;
  submittedBy?: {
    email: string;
    client: {
      id: number;
      cityIdNumber: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      address: string | null;
      dateOfBirth: string | null;
      clientCategory: string;
      educationLevel: string;
      occupation: string | null;
      monthlyIncome: string | null;
      spouseCityIdNumber: string | null;
      familyMembersCount: number | null;
      contactInfo: {
        email: string;
        phoneNumber: string;
      };
      activeStatus: boolean;
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
  handledBy?: any;
}

export interface CreateComplaintDto {
  subject: string;
  description: string;
  category: ComplaintCategory;
}

export interface ResolveComplaintDto {
  status: ComplaintStatus;
  resolution: string;
}
