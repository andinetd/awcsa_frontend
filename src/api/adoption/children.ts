import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import { Child } from "@/types/child-matching-types";
import axios from "axios";

export const getChildren = async (): Promise<Child[]> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/adoption/child`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resp = res.data;

  if (Array.isArray(resp)) {
    return resp;
  } else if (resp?.data && Array.isArray(resp.data)) {
    return resp.data;
  } else if (resp?.content && Array.isArray(resp.content)) {
    return resp.content;
  } else if (resp?.children && Array.isArray(resp.children)) {
    return resp.children;
  }

  return [];
};

export const getChildrenByStatus = async (status: string): Promise<Child[]> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/adoption/child/status/${status}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resp = res.data;
  if (Array.isArray(resp)) {
    return resp;
  } else if (resp?.data && Array.isArray(resp.data)) {
    return resp.data;
  } else if (resp?.content && Array.isArray(resp.content)) {
    return resp.content;
  } else if (resp?.children && Array.isArray(resp.children)) {
    return resp.children;
  }

  return [];
};

export const getChildById = async (id: number): Promise<Child> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/adoption/child/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export interface TransferChildStatusPayload {
  newStatus: string;
  reasonForTransfer?: string;
  childCareFacilityId?: number;
  childIdFromFacility?: string;
  custodianId?: number;
  custodianDetails?: Record<string, any>;
  additionalNotes?: string;
}

export const transferChildStatus = async (
  childId: number,
  payload: TransferChildStatusPayload
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.patch(
    `${BASE_URL}/adoption/child/status/${childId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const updateChild = async (id: number, payload: Record<string, any>) => {
  const { token } = useAuthStore.getState();
  const res = await axios.patch(`${BASE_URL}/adoption/child/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// =====================================================================
// Care Plan API
// =====================================================================

export const createCarePlan = async (
  childId: number,
  payload: {
    primaryGoal: string;
    secondaryGoal?: string;
    nextReviewDue: string;
    reviewCycleMonths?: number;
    notes?: string;
    reunificationEffortDetails?: string;
  }
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(
    `${BASE_URL}/children/${childId}/care-plan`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const clearChildForAdoption = async (
  childId: number,
  payload: {
    reunificationEffortDetails: string;
    courtOrderNumber?: string;
    clearedAt?: string;
    notes?: string;
  }
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(
    `${BASE_URL}/children/${childId}/care-plan/clear-for-adoption`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// =====================================================================
// Sibling Group API
// =====================================================================

export const createSiblingGroup = async (payload: {
  childIds: number[];
  groupCode?: string;
  notes?: string;
}) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(`${BASE_URL}/children/siblings`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addSiblingToGroup = async (
  groupId: number,
  childId: number
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(
    `${BASE_URL}/children/siblings/${groupId}/add`,
    { childId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const removeSiblingFromGroup = async (
  groupId: number,
  childId: number
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.delete(
    `${BASE_URL}/children/siblings/${groupId}/remove/${childId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getChildSiblings = async (childId: number) => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/children/${childId}/siblings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// =====================================================================
// Digital Child Dossier API
// =====================================================================

export const upsertMedicalRecord = async (
  childId: number,
  payload: {
    bloodGroup?: string;
    allergies?: any;
    chronicConditions?: any;
    disabilities?: any;
    immunizations?: any;
    generalHealthSummary?: string;
    specialCareNeeds?: string;
    lastCheckupDate?: string;
  }
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.put(
    `${BASE_URL}/children/${childId}/dossier/medical`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const addDevelopmentMilestone = async (
  childId: number,
  payload: {
    milestoneType: string;
    ageCategory: string;
    milestoneTitle: string;
    status?: string;
    assessmentDate?: string;
    observations?: string;
  }
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(
    `${BASE_URL}/children/${childId}/dossier/milestones`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const addGrowthPhoto = async (
  childId: number,
  payload: {
    photoUrl: string;
    photoDate?: string;
    approximateAgeMonths?: number;
    isPrimaryPortrait?: boolean;
    caption?: string;
  }
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(
    `${BASE_URL}/children/${childId}/dossier/photos`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const addFamilyTracingLog = async (
  childId: number,
  payload: {
    searchMethod: string;
    conductedAt?: string;
    location?: string;
    findings: string;
    outcome?: string;
    documents?: any;
  }
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(
    `${BASE_URL}/children/${childId}/dossier/tracing`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getFullDossier = async (childId: number) => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/children/${childId}/dossier`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// =====================================================================
// PHASE 2 API: Biometrics, Adera Custody & Facility Census Audits
// =====================================================================

export const registerChildBiometrics = async (
  childId: number,
  payload: {
    facialPhotoUrl: string;
    photoHash?: string;
    identifyingMarks?: any[];
    biometricConsent?: boolean;
  }
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.put(`${BASE_URL}/children/${childId}/biometrics`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getChildBiometrics = async (childId: number) => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/children/${childId}/biometrics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const checkChildDuplicates = async (payload: {
  photoHash?: string;
  firstName?: string;
  estimatedAgeYears?: number;
  gender?: string;
}) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(`${BASE_URL}/children/biometrics/check-duplicates`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const formalizeAderaCustody = async (
  childId: number,
  payload: {
    custodianId: number;
    relationshipToChild?: string;
    reasonForAdera: string;
    custodyAgreementDocUrl?: string;
    monthlyStipend?: number;
    isCourtApproved?: boolean;
    nextCheckupDue?: string;
    notes?: string;
  }
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(`${BASE_URL}/children/${childId}/adera/formalize`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAderaCustody = async (childId: number) => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/children/${childId}/adera`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const recordAderaCheckup = async (
  childId: number,
  payload: {
    visitDate?: string;
    livingConditionRating: string;
    safetyAssessment: string;
    childSchoolingStatus: string;
    childHealthStatus: string;
    riskFlags?: string[];
    socialWorkerRemarks: string;
    safetyRecommendation: string;
    nextCheckupDue?: string;
  }
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(`${BASE_URL}/children/${childId}/adera/checkup`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const convertAderaStatus = async (
  childId: number,
  payload: {
    targetStatus: string;
    notes?: string;
    courtOrderUrl?: string;
  }
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.patch(`${BASE_URL}/children/${childId}/adera/convert`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getFacilityCapacityOverview = async (facilityId: number) => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/care-center/facilities/${facilityId}/capacity`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const conductFacilityCensusAudit = async (
  facilityId: number,
  payload: {
    physicalHeadcount: number;
    auditDate?: string;
    notes?: string;
    findings?: any;
  }
) => {
  const { token } = useAuthStore.getState();
  const res = await axios.post(
    `${BASE_URL}/care-center/facilities/${facilityId}/census-audit`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};



