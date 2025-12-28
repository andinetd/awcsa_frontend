export interface EdirMember {
  id: number;
  associationId: number;
  fullName: string; // Added based on assumption, user example lacked it but it's essential
  edirIdNumber: string;
  cityIdNumber: string;
  phoneNumber: string;
  job: string;
  position: "LEADER" | "MEMBER" | "COMMITTEE" | string;
  familyMembersCount: number;
  joinedAt: string;
  leftAt?: string | null;
  isActive: boolean;
}

export interface CreateEdirMemberPayload {
  associationId: number;
  fullName: string;
  edirIdNumber: string;
  cityIdNumber: string;
  phoneNumber: string;
  job: string;
  position: string;
  familyMembersCount: number;
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
}

export type UpdateEdirMemberPayload = Partial<CreateEdirMemberPayload>;
