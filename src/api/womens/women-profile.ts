export interface Client {
  id: number;
  faydaId?: string | null;
  cityIdNumber?: string | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  subCity?: string | null;
  woreda?: string | null;
  dateOfBirth?: string;
  age?: number;
  clientCategory: string;
  educationLevel: string;
  occupation: string;
  careerStatus?: string;
  monthlyIncome?: number;
  spouseCityIdNumber?: string | null;
  familyMembersCount?: number | null;
  contactInfo: {
    email?: string;
    phone?: string;
    phoneNumber?: string;
    address?: string;
  };
  activeStatus: boolean;
  isDeleted: boolean;
  SupportRecord?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface WomenProfile {
  id: number;
  clientId: number;
  educationLevel: string;
  occupation: string;
  careerStatus?: string;
  photoUrl?: string;
  isActive: boolean;
  isDeleted: boolean;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  client: Client;
  technologySupport?: any[];
  trainings?: any[];
}
