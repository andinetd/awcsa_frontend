export interface Client {
  id: number;
  cityIdNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
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
}
