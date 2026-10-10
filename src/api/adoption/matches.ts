import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

export type PostMatchNoteCategory =
  | "GENERAL"
  | "PLACEMENT_PROGRESS"
  | "HEALTH"
  | "EDUCATION"
  | "LEGAL_NOTE"
  | "CONCERN_OR_INCIDENT"
  | "OFFICIAL_REMARK";

export type MatchStatus = "ACTIVE" | "COMPLETED" | "TERMINATED";

export interface PostMatchNote {
  id: number;
  matchId: number;
  authorId: number;
  category: PostMatchNoteCategory;
  title: string;
  content: string;
  attachments?: any;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole: string;
    department?: string;
  };
}

export interface CreatePostMatchNotePayload {
  category?: PostMatchNoteCategory;
  title: string;
  content: string;
  attachments?: any;
}

export interface UpdatePostMatchNotePayload {
  category?: PostMatchNoteCategory;
  title?: string;
  content?: string;
  attachments?: any;
}

export interface UpdateMatchPayload {
  status?: MatchStatus;
  remark?: string;
  supervisingEmployeeId?: number;
  terminationReason?: string;
}

export interface AdoptionMatchDetails {
  id: number;
  status: MatchStatus;
  remark?: string;
  matchedAt: string;
  completedAt?: string;
  terminatedAt?: string;
  child: any;
  adopter: any;
  matchedBy: any;
  supervisingEmployee?: any;
  postMatchNotes: PostMatchNote[];
}

const getAuthHeaders = () => {
  const { token } = useAuthStore.getState();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getMatchNotes = async (
  matchId: number,
  category?: string,
): Promise<PostMatchNote[]> => {
  const url = category && category !== "ALL"
    ? `${BASE_URL}/adoption/matches/${matchId}/notes?category=${category}`
    : `${BASE_URL}/adoption/matches/${matchId}/notes`;

  const res = await axios.get(url, { headers: getAuthHeaders() });
  return res.data?.data || [];
};

export const getMatchDetails = async (
  matchId: number,
): Promise<AdoptionMatchDetails> => {
  const res = await axios.get(`${BASE_URL}/adoption/matches/details/${matchId}`, {
    headers: getAuthHeaders(),
  });
  return res.data?.data;
};

export const addPostMatchNote = async (
  matchId: number,
  payload: CreatePostMatchNotePayload,
): Promise<PostMatchNote> => {
  const res = await axios.post(
    `${BASE_URL}/adoption/matches/${matchId}/notes`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data?.data;
};

export const updatePostMatchNote = async (
  matchId: number,
  noteId: number,
  payload: UpdatePostMatchNotePayload,
): Promise<PostMatchNote> => {
  const res = await axios.patch(
    `${BASE_URL}/adoption/matches/${matchId}/notes/${noteId}`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data?.data;
};

export const updateMatch = async (
  matchId: number,
  payload: UpdateMatchPayload,
): Promise<any> => {
  const res = await axios.patch(
    `${BASE_URL}/adoption/matches/${matchId}`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data?.data;
};

// ─── Follow-Up Reports ────────────────────────────────────────────────────────

export type FollowUpReportStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "REVIEWED"
  | "REQUIRES_ACTION";

export interface FollowUpReport {
  id: number;
  matchId: number;
  submittedById: number;
  reportPeriod: string;
  childHealthStatus: string;
  emotionalWellbeing: string;
  educationProgress: string;
  familyIntegration: string;
  additionalNotes?: string | null;
  attachments?: any;
  status: FollowUpReportStatus;
  reviewedById?: number | null;
  reviewedAt?: string | null;
  officerFeedback?: string | null;
  officerConcerns?: string | null;
  createdAt: string;
  updatedAt: string;
  submitter: {
    id: number;
    firstName: string;
    lastName: string;
    cityIdNumber?: string;
  };
  reviewedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole: string;
    department?: string;
  } | null;
}

export interface CreateFollowUpReportPayload {
  reportPeriod: string;
  childHealthStatus: string;
  emotionalWellbeing: string;
  educationProgress: string;
  familyIntegration: string;
  additionalNotes?: string;
  attachments?: any;
}

export interface ReviewFollowUpReportPayload {
  status?: FollowUpReportStatus;
  officerFeedback?: string;
  officerConcerns?: string;
}

export const listFollowUpReports = async (
  matchId: number,
  status?: FollowUpReportStatus,
): Promise<FollowUpReport[]> => {
  const url =
    status
      ? `${BASE_URL}/adoption/matches/${matchId}/followup-reports?status=${status}`
      : `${BASE_URL}/adoption/matches/${matchId}/followup-reports`;
  const res = await axios.get(url, { headers: getAuthHeaders() });
  return res.data?.data || [];
};

export const getFollowUpReport = async (
  matchId: number,
  reportId: number,
): Promise<FollowUpReport> => {
  const res = await axios.get(
    `${BASE_URL}/adoption/matches/${matchId}/followup-reports/${reportId}`,
    { headers: getAuthHeaders() },
  );
  return res.data?.data;
};

export const submitFollowUpReport = async (
  matchId: number,
  payload: CreateFollowUpReportPayload,
): Promise<FollowUpReport> => {
  const res = await axios.post(
    `${BASE_URL}/adoption/matches/${matchId}/followup-reports`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data?.data;
};

export const reviewFollowUpReport = async (
  matchId: number,
  reportId: number,
  payload: ReviewFollowUpReportPayload,
): Promise<FollowUpReport> => {
  const res = await axios.patch(
    `${BASE_URL}/adoption/matches/${matchId}/followup-reports/${reportId}/review`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data?.data;
};

// ─── Post-Placement Home Visit Evaluations ────────────────────────────────────

export type VisitSafetyRating =
  | "SAFE"
  | "MINOR_CONCERNS"
  | "MAJOR_CONCERNS"
  | "UNSAFE";

export type VisitOverallRating =
  | "EXCELLENT"
  | "GOOD"
  | "SATISFACTORY"
  | "NEEDS_IMPROVEMENT"
  | "CRITICAL";

export interface PostPlacementVisit {
  id: number;
  matchId: number;
  visitedById: number;
  visitDate: string;
  livingConditions: string;
  childHealthStatus: string;
  bondingObservation: string;
  schoolingStatus?: string | null;
  safetyAssessment: VisitSafetyRating;
  overallRating: VisitOverallRating;
  concerns?: string | null;
  recommendations?: string | null;
  nextVisitDue?: string | null;
  attachments?: any;
  createdAt: string;
  updatedAt: string;
  visitedBy: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole: string;
    department?: string;
  };
}

export interface CreatePostPlacementVisitPayload {
  visitDate?: string;
  livingConditions: string;
  childHealthStatus: string;
  bondingObservation: string;
  schoolingStatus?: string | null;
  safetyAssessment: VisitSafetyRating;
  overallRating: VisitOverallRating;
  concerns?: string | null;
  recommendations?: string | null;
  nextVisitDue?: string | null;
  attachments?: any;
}

export interface UpdatePostPlacementVisitPayload {
  livingConditions?: string;
  childHealthStatus?: string;
  bondingObservation?: string;
  schoolingStatus?: string | null;
  safetyAssessment?: VisitSafetyRating;
  overallRating?: VisitOverallRating;
  concerns?: string | null;
  recommendations?: string | null;
  nextVisitDue?: string | null;
  attachments?: any;
}

export const listPostPlacementVisits = async (
  matchId: number,
): Promise<PostPlacementVisit[]> => {
  const res = await axios.get(
    `${BASE_URL}/adoption/matches/${matchId}/visits`,
    { headers: getAuthHeaders() },
  );
  return res.data?.data || [];
};

export const getPostPlacementVisit = async (
  matchId: number,
  visitId: number,
): Promise<PostPlacementVisit> => {
  const res = await axios.get(
    `${BASE_URL}/adoption/matches/${matchId}/visits/${visitId}`,
    { headers: getAuthHeaders() },
  );
  return res.data?.data;
};

export const recordPostPlacementVisit = async (
  matchId: number,
  payload: CreatePostPlacementVisitPayload,
): Promise<PostPlacementVisit> => {
  const res = await axios.post(
    `${BASE_URL}/adoption/matches/${matchId}/visits`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data?.data;
};

export const updatePostPlacementVisit = async (
  matchId: number,
  visitId: number,
  payload: UpdatePostPlacementVisitPayload,
): Promise<PostPlacementVisit> => {
  const res = await axios.patch(
    `${BASE_URL}/adoption/matches/${matchId}/visits/${visitId}`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data?.data;
};

// ─── Biological Parents Reunification & Handover ──────────────────────────────

export interface BiologicalParentReunification {
  id: number;
  matchId: number;
  childRegistrationId: number;
  processedById: number;
  reunificationDate: string;
  fatherName?: string | null;
  motherName?: string | null;
  contactPhoneNumber: string;
  nationalIdNumber?: string | null;
  currentAddress: string;
  courtOrderNumber?: string | null;
  reunificationReason: string;
  socialWorkerNotes?: string | null;
  reopenedForRematch: boolean;
  adopterSupportNotes?: string | null;
  attachments?: any;
  createdAt: string;
  updatedAt: string;
  processedBy: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole: string;
    department?: string;
  };
}

export interface ProcessReunificationPayload {
  reunificationDate?: string;
  fatherName?: string | null;
  motherName?: string | null;
  contactPhoneNumber: string;
  nationalIdNumber?: string | null;
  currentAddress: string;
  courtOrderNumber?: string | null;
  reunificationReason: string;
  socialWorkerNotes?: string | null;
  reopenApplicationForRematch?: boolean;
  adopterSupportNotes?: string | null;
  attachments?: any;
}

export const processReunification = async (
  matchId: number,
  payload: ProcessReunificationPayload,
): Promise<BiologicalParentReunification> => {
  const res = await axios.post(
    `${BASE_URL}/adoption/matches/${matchId}/reunification`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data?.data;
};

export const getReunificationDetails = async (
  matchId: number,
): Promise<BiologicalParentReunification> => {
  const res = await axios.get(
    `${BASE_URL}/adoption/matches/${matchId}/reunification`,
    { headers: getAuthHeaders() },
  );
  return res.data?.data;
};

// =====================================================================
// Phase 3: Intelligent Matching & Committee API Methods
// =====================================================================

export const getMatchRecommendationsForApplication = async (
  applicationId: number,
) => {
  const res = await axios.get(
    `${BASE_URL}/adoption/intelligent-matching/recommendations/application/${applicationId}`,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

export const saveFamilySuitabilityAssessment = async (
  applicationId: number,
  payload: any,
) => {
  const res = await axios.post(
    `${BASE_URL}/adoption/intelligent-matching/suitability-assessment/${applicationId}`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

export const getFamilySuitabilityAssessment = async (applicationId: number) => {
  const res = await axios.get(
    `${BASE_URL}/adoption/intelligent-matching/suitability-assessment/${applicationId}`,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

export const recordAdoptionCommitteeReview = async (payload: any) => {
  const res = await axios.post(
    `${BASE_URL}/adoption/intelligent-matching/committee-review`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

export const getAdoptionCommitteeReviews = async (params?: {
  applicationId?: number;
  childRegistrationId?: number;
}) => {
  const res = await axios.get(
    `${BASE_URL}/adoption/intelligent-matching/committee-reviews`,
    {
      params,
      headers: getAuthHeaders(),
    },
  );
  return res.data;
};

export const executeConfirmedAdoptionMatch = async (payload: {
  childIdFromFacility: string;
  applicantId: number;
  applicationId: number;
  committeeReviewId?: number | null;
  matchScore?: number | null;
  scoringBreakdown?: Record<string, any> | null;
  note?: string | null;
}) => {
  const res = await axios.post(
    `${BASE_URL}/adoption/intelligent-matching/execute-match`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

// ─── Phase 4: Court Proceedings & VERA Civil Registry ────────────────────────

export const initiateCourtPetition = async (
  matchId: number,
  payload: {
    courtName: string;
    benchName?: string;
    courtFileNumber: string;
    presidingJudge?: string;
    filingDate?: string;
    nextHearingDate?: string;
    statusRemarks?: string;
  },
) => {
  const res = await axios.post(
    `${BASE_URL}/adoption/court-proceedings/match/${matchId}/petition`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

export const getCourtBundleManifest = async (matchId: number) => {
  const res = await axios.get(
    `${BASE_URL}/adoption/court-proceedings/match/${matchId}/court-bundle`,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

export const recordCourtHearing = async (
  caseId: number,
  payload: {
    hearingDate: string;
    hearingType: string;
    attendees?: Array<{ name: string; role: string }>;
    judgeOrders?: string;
    postponementReason?: string;
    nextHearingDate?: string;
  },
) => {
  const res = await axios.post(
    `${BASE_URL}/adoption/court-proceedings/cases/${caseId}/hearings`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

export const finalizeAdoptionDecree = async (
  caseId: number,
  payload: {
    decreeNumber: string;
    decreeDate: string;
    decreeDocumentUrl?: string;
    certifiedCopyUrl?: string;
    legalOrdersSummary?: string;
  },
) => {
  const res = await axios.post(
    `${BASE_URL}/adoption/court-proceedings/cases/${caseId}/decree`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

export const recordVeraLinkage = async (
  matchId: number,
  payload: {
    veraOfficeBranch: string;
    decreeSubmissionDate?: string;
    registrationNumber?: string;
    amendedBirthCertNumber: string;
    dateIssued?: string;
    originalCertArchived?: boolean;
    certificateDocumentUrl?: string;
    notes?: string;
  },
) => {
  const res = await axios.post(
    `${BASE_URL}/adoption/court-proceedings/match/${matchId}/vera-linkage`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

export const getCourtCaseDetails = async (matchId: number) => {
  const res = await axios.get(
    `${BASE_URL}/adoption/court-proceedings/match/${matchId}`,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

export const initiateInterRegionalTransfer = async (payload: {
  childRegistrationId: number;
  originRegion: string;
  destinationRegion: string;
  liaisonOfficerName: string;
  liaisonOfficerPhone?: string;
  officialLetterNumber: string;
  transferReason: string;
  handoverProtocolDocUrl?: string;
  notes?: string;
}) => {
  const res = await axios.post(
    `${BASE_URL}/adoption/court-proceedings/inter-regional-transfer`,
    payload,
    { headers: getAuthHeaders() },
  );
  return res.data;
};

export const getInterRegionalTransfers = async (childRegistrationId?: number) => {
  const res = await axios.get(
    `${BASE_URL}/adoption/court-proceedings/inter-regional-transfers`,
    {
      params: childRegistrationId ? { childRegistrationId } : undefined,
      headers: getAuthHeaders(),
    },
  );
  return res.data;
};


