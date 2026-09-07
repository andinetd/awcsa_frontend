import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export type WomenAssociationType =
  | "ASSOCIATION"
  | "DEVELOPMENT_ASSOCIATION"
  | "FEDERATION";

export type WomenLeaderPosition =
  | "CHAIRPERSON"
  | "VICE_CHAIRPERSON"
  | "SECRETARY"
  | "WORK_SKILLS_RESPONSIBLE"
  | "EDUCATION_RESPONSIBLE";

export type WomenAssociationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export type WomenAssociationDocumentType =
  | "ENTRY_SIGNATURE"
  | "APPROVAL_SIGNATURE";

export interface WomenAssociationLeader {
  id?: number;
  associationId?: number;
  position: WomenLeaderPosition;
  fullName: string;
  phoneNumber: string;
}

export interface WomenAssociationGroup {
  id: number;
  associationId: number;
  groupNumber: number;
  name?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { members: number };
}

export interface WomenAssociationMember {
  id?: number;
  associationId?: number;
  groupId?: number | null;
  groupNumber: number;
  serialNumber: number;
  fullName: string;
  phoneNumber?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface WomenAssociationRecord {
  id: number;
  name: string;
  type: WomenAssociationType;
  establishmentDate: string;
  objective?: string | null;
  subCity: string;
  woreda: string;
  houseNumber?: string | null;
  block?: string | null;
  leaderName: string;
  leaderPhoneNumber: string;
  totalMembers?: number | null;
  isActive: boolean;
  isDeleted: boolean;
  approvalStatus: WomenAssociationStatus;
  enteredById?: number | null;
  enteredByName?: string | null;
  enteredAt?: string | null;
  entrySignatureDocId?: number | null;
  approvedById?: number | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  approvalSignatureDocId?: number | null;
  rejectionReason?: string | null;
  leaders?: WomenAssociationLeader[];
  oneToTenMembers?: WomenAssociationMember[];
  groups?: WomenAssociationGroup[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWomenAssociationPayload {
  name: string;
  type: WomenAssociationType;
  establishmentDate: string;
  objective?: string;
  subCity: string;
  woreda: string;
  houseNumber?: string;
  block?: string;
  leaderName: string;
  leaderPhoneNumber: string;
  totalMembers?: number;
  leaders?: Omit<WomenAssociationLeader, "id" | "associationId">[];
}

export interface UpdateWomenAssociationPayload
  extends Partial<CreateWomenAssociationPayload> {}

const getAuthHeaders = () => {
  const { token } = useAuthStore.getState();
  return { Authorization: `Bearer ${token}` };
};

export const getWomenAssociations = async (params?: {
  search?: string;
  subCity?: string;
  woreda?: string;
  type?: WomenAssociationType;
  status?: WomenAssociationStatus;
}) => {
  const { data } = await axios.get(`${BASE_URL}/women/associations`, {
    headers: getAuthHeaders(),
    params,
  });
  return data;
};

export const getWomenAssociationById = async (id: number) => {
  const { data } = await axios.get(`${BASE_URL}/women/associations/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
};

export const registerWomenAssociation = async (
  payload: CreateWomenAssociationPayload
) => {
  const { data } = await axios.post(
    `${BASE_URL}/women/associations`,
    payload,
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    }
  );
  return data;
};

export const updateWomenAssociation = async (payload: {
  id: number;
  data: UpdateWomenAssociationPayload;
}) => {
  const { data } = await axios.patch(
    `${BASE_URL}/women/associations/${payload.id}`,
    payload.data,
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    }
  );
  return data;
};

export const deleteWomenAssociation = async (id: number) => {
  const { data } = await axios.delete(
    `${BASE_URL}/women/associations/${id}`,
    { headers: getAuthHeaders() }
  );
  return data;
};

export const saveWomenAssociationMembers = async (payload: {
  id: number;
  members: Omit<WomenAssociationMember, "id" | "associationId" | "groupId" | "isActive" | "isDeleted">[];
}) => {
  const { data } = await axios.put(
    `${BASE_URL}/women/associations/${payload.id}/members`,
    { members: payload.members },
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    }
  );
  return data;
};

export const uploadAssociationDocument = async (file: File, type: WomenAssociationDocumentType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  const { data } = await axios.post(
    `${BASE_URL}/women/associations/documents`,
    formData,
    { headers: getAuthHeaders() }
  );
  return data as {
    message: string;
    data: { id: number; type: WomenAssociationDocumentType; fileName: string; fileType: string };
  };
};

export const getAssociationDocumentUrl = (docId: number) =>
  `${BASE_URL}/women/associations/documents/${docId}`;

export const submitAssociation = async (payload: {
  id: number;
  enteredByName: string;
  entrySignatureDocId?: number;
}) => {
  const { data } = await axios.post(
    `${BASE_URL}/women/associations/${payload.id}/submit`,
    {
      enteredByName: payload.enteredByName,
      ...(payload.entrySignatureDocId !== undefined
        ? { entrySignatureDocId: payload.entrySignatureDocId }
        : {}),
    },
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    }
  );
  return data;
};

export const reviewAssociation = async (payload: {
  id: number;
  decision: "APPROVED" | "REJECTED";
  approvedByName: string;
  approvalSignatureDocId?: number;
  rejectionReason?: string;
}) => {
  const { data } = await axios.post(
    `${BASE_URL}/women/associations/${payload.id}/review`,
    payload,
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    }
  );
  return data;
};

// ─── GROUPS ────────────────────────────────────────────────────

export const getAssociationGroups = async (associationId: number) => {
  const { data } = await axios.get(
    `${BASE_URL}/women/associations/${associationId}/groups`,
    { headers: getAuthHeaders() }
  );
  return data as { message: string; data: WomenAssociationGroup[] };
};

export const addAssociationGroup = async (payload: {
  id: number;
  groupNumber: number;
  name?: string;
}) => {
  const { data } = await axios.post(
    `${BASE_URL}/women/associations/${payload.id}/groups`,
    { groupNumber: payload.groupNumber, name: payload.name },
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    }
  );
  return data as { message: string; data: WomenAssociationGroup };
};

export const renameAssociationGroup = async (payload: {
  id: number;
  groupId: number;
  name: string | null;
}) => {
  const { data } = await axios.patch(
    `${BASE_URL}/women/associations/${payload.id}/groups/${payload.groupId}`,
    { name: payload.name },
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    }
  );
  return data as { message: string; data: WomenAssociationGroup };
};

export const deleteAssociationGroup = async (payload: {
  id: number;
  groupId: number;
}) => {
  const { data } = await axios.delete(
    `${BASE_URL}/women/associations/${payload.id}/groups/${payload.groupId}`,
    { headers: getAuthHeaders() }
  );
  return data as { message: string };
};

// ─── MEMBERS (cross-association) ────────────────────────────────

export interface WomenAssociationMemberListItem {
  id: number;
  associationId: number;
  groupId: number | null;
  groupNumber: number;
  serialNumber: number;
  fullName: string;
  phoneNumber: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  association?: {
    id: number;
    name: string;
    subCity: string;
    woreda: string;
  };
  group?: {
    id: number;
    groupNumber: number;
    name: string | null;
  } | null;
}

export interface WomenMemberListResponse {
  message: string;
  data: WomenAssociationMemberListItem[];
  meta: { total: number; page: number; limit: number };
}

export interface WomenMemberDuplicateMatch {
  id: number;
  fullName: string;
  phoneNumber: string | null;
  groupNumber: number;
  serialNumber: number;
  associationId: number;
}

export interface WomenMemberDuplicateResponse {
  message: string;
  data: {
    exists: boolean;
    matches: WomenMemberDuplicateMatch[];
  };
}

export const listMembers = async (params?: {
  search?: string;
  phone?: string;
  associationId?: number;
  groupId?: number;
  subCity?: string;
  woreda?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await axios.get(`${BASE_URL}/women/members`, {
    headers: getAuthHeaders(),
    params,
  });
  return data as WomenMemberListResponse;
};

export const updateMember = async (payload: {
  id: number;
  fullName: string;
  phoneNumber?: string;
}) => {
  const { data } = await axios.patch(
    `${BASE_URL}/women/members/${payload.id}`,
    { fullName: payload.fullName, phoneNumber: payload.phoneNumber },
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    }
  );
  return data;
};

export const moveMember = async (payload: {
  id: number;
  toGroupId: number;
  toSerialNumber: number;
}) => {
  const { data } = await axios.post(
    `${BASE_URL}/women/members/${payload.id}/move`,
    { toGroupId: payload.toGroupId, toSerialNumber: payload.toSerialNumber },
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    }
  );
  return data;
};

export const deleteMember = async (id: number) => {
  const { data } = await axios.delete(`${BASE_URL}/women/members/${id}`, {
    headers: getAuthHeaders(),
  });
  return data as { message: string };
};

export const checkMemberDuplicate = async (payload: {
  phone: string;
  associationId: number;
  excludeMemberId?: number;
}) => {
  const { data } = await axios.post(
    `${BASE_URL}/women/members/check-duplicate`,
    payload,
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    }
  );
  return data as WomenMemberDuplicateResponse;
};

// ─── DASHBOARD (FR-12) ──────────────────────────────────────────

export interface WomenAssociationDashboard {
  total: number;
  totalGroups: number;
  totalMembers: number;
  declaredMembers: number;
  incomplete: number;
  byStatus: {
    DRAFT: number;
    SUBMITTED: number;
    APPROVED: number;
    REJECTED: number;
  };
  bySubCity: {
    subCity: string;
    total: number;
    approved: number;
    members: number;
  }[];
  byWoreda: {
    subCity: string;
    woreda: string;
    total: number;
    members: number;
  }[];
}

export interface WomenAssociationDashboardResponse {
  message: string;
  data: WomenAssociationDashboard;
}

export const getAssociationDashboard = async (params?: {
  subCity?: string;
  woreda?: string;
}) => {
  const { data } = await axios.get(
    `${BASE_URL}/women/associations/dashboard`,
    { headers: getAuthHeaders(), params }
  );
  return data as WomenAssociationDashboardResponse;
};
