// Represents the nested `formData` inside the serviceData for a child
interface ChildFormData {
  sex?: string;
  lastName?: string;
  firstName?: string;
  dateOfBirth?: string;
  currentStatus?: string;
  additionalInfo?: string;
  timeWhenChildFound?: string;
  placeWhereChildFound?: string;
  socialWorkerCityIdNumber?: string;
}

interface Client {
  id: number;
  cityIdNumber?: string | null;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  clientCategory?: string | null;
  contactInfo?: Record<string, any> | null;
}

interface ServiceData {
  id: number;
  clientId?: number;
  employeeId?: number | null;
  formData: ChildFormData;
  status?: string;
  client?: Client;
}

export interface ChildCareFacility {
  id: number;
  name: string;
  place: string;
  type: string;
  childrenAgeRange?: {
    max: number;
    min: number;
  };
  phone?: string | null;
  email?: string | null;
  region?: string | null;
  subCity?: string | null;
  woreda?: string | null;
  kebele?: string | null;
  houseNumber?: string | null;
  description?: string | null;
  orgUnitId?: number;
  createdAt?: string;
  updatedAt?: string;
  // Account Info
  contactPerson?: string;
  loginUsername?: string;
}
export type ChildStatus =
  | "FOUND"
  | "IN_CARE"
  | "IN_ADERA"
  | "WITH_BLOOD_RELATIVE"
  | "ADOPTED"
  | "RETURNED";

export const ALLOWED_CHILD_TRANSITIONS: Record<ChildStatus, ChildStatus[]> = {
  FOUND: ["IN_CARE", "IN_ADERA", "WITH_BLOOD_RELATIVE", "RETURNED"],
  IN_CARE: ["IN_ADERA", "WITH_BLOOD_RELATIVE", "RETURNED"],
  IN_ADERA: ["IN_CARE", "WITH_BLOOD_RELATIVE", "RETURNED"],
  WITH_BLOOD_RELATIVE: ["IN_CARE", "RETURNED"],
  RETURNED: ["IN_CARE", "IN_ADERA"],
  ADOPTED: [],
};

// Main Child interface that matches the example payload
export interface Child {
  id: number;
  serviceDataId: number;
  childCareFacilityId?: number | null;
  childIdFromFacility?: string | null;
  reasonForReturn?: string | null;
  placeWhereChildFound?: string;
  timeWhenChildFound?: string;
  socialWorkerCityIdNumber?: string;
  additionalInfo?: string;
  currentStatus?: ChildStatus | string;
  custodianId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  serviceData: ServiceData;
  childCareFacility?: {
    id: number;
    name: string;
    place?: string;
    type?: string;
    phone?: string | null;
    email?: string | null;
    region?: string | null;
    subCity?: string | null;
    woreda?: string | null;
    kebele?: string | null;
    contactPerson?: string;
  } | null;
  custodian?: Client | null;
  adoptionMatches?: Array<{
    id: number;
    status: string;
    matchedAt: string;
    completedAt?: string | null;
    terminatedAt?: string | null;
    adopter?: Client;
    matchedBy?: {
      id: number;
      firstName: string;
      lastName: string;
      employeeRole?: string;
    };
    application?: ServiceData;
  }>;
  reunifications?: Array<{
    id: number;
    reunificationDate: string;
    fatherName?: string | null;
    motherName?: string | null;
    contactPhoneNumber?: string | null;
    nationalIdNumber?: string | null;
    courtOrderNumber?: string | null;
    reunificationReason?: string;
    socialWorkerNotes?: string | null;
    processedBy?: {
      id: number;
      firstName: string;
      lastName: string;
      employeeRole?: string;
    };
  }>;
  transferHistory?: ChildTransferHistory[];
  siblingGroupId?: number | null;
  siblingGroup?: SiblingGroup | null;
  carePlans?: ChildCarePlan[];
  medicalRecord?: ChildMedicalRecord | null;
  developmentMilestones?: ChildDevelopmentMilestone[];
  growthPhotos?: ChildGrowthPhoto[];
  familyTracingLogs?: FamilyTracingLog[];
  biometricRecord?: ChildBiometricRecord | null;
  aderaCustody?: AderaCustodyRecord | null;
}

export interface ChildTransferHistory {
  id: number;
  childRegistrationId: number;
  fromStatus: ChildStatus | string;
  toStatus: ChildStatus | string;
  reason?: string | null;
  transferredById?: number | null;
  transferredAt: string;
  childCareFacilityId?: number | null;
  childIdFromFacility?: string | null;
  custodianId?: number | null;
  custodianDetails?: {
    fullName?: string;
    phoneNumber?: string;
    relationship?: string;
    cityIdNumber?: string;
    address?: string;
    notes?: string;
    [key: string]: any;
  } | null;
  additionalNotes?: string | null;
  createdAt?: string;
  transferredBy?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  } | null;
  childCareFacility?: {
    id: number;
    name: string;
    place?: string;
    type?: string;
    phone?: string | null;
    email?: string | null;
    subCity?: string | null;
    woreda?: string | null;
  } | null;
  custodian?: Client | null;
}

export interface MatchRequest {
  childIdFromFacility: string;
  applicantId: number | undefined;
  applicationId: number;
  note?: string;
}

// =====================================================================
// Phase 1: Sibling Groups, Care Plans & Digital Dossier Types
// =====================================================================

export interface SiblingGroup {
  id: number;
  groupCode: string;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  children?: Child[];
}

export type CarePlanGoal =
  | "REUNIFICATION"
  | "KINSHIP_CARE"
  | "ADOPTION"
  | "FOSTER_CARE"
  | "INDEPENDENT_LIVING";

export type CarePlanStatus = "DRAFT" | "ACTIVE" | "ACHIEVED" | "SUPERSEDED";

export interface ChildCarePlan {
  id: number;
  childRegistrationId: number;
  primaryGoal: CarePlanGoal;
  secondaryGoal?: CarePlanGoal | null;
  status: CarePlanStatus;
  reunificationExhausted: boolean;
  clearedForAdoptionDate?: string | null;
  reviewCycleMonths: number;
  nextReviewDue: string;
  assignedWorkerId: number;
  assignedWorker?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  };
  notes?: string | null;
  reunificationEffortDetails?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChildMedicalRecord {
  id: number;
  childRegistrationId: number;
  bloodGroup?: string | null;
  allergies?: string[] | any;
  chronicConditions?: string[] | any;
  disabilities?: Record<string, any> | null;
  immunizations?: Array<{
    vaccine: string;
    dateGiven: string;
    facility?: string;
  }> | any;
  generalHealthSummary?: string | null;
  specialCareNeeds?: string | null;
  lastCheckupDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type MilestoneType =
  | "MOTOR"
  | "COGNITIVE"
  | "LANGUAGE"
  | "SOCIAL_EMOTIONAL";

export type MilestoneStatus = "ON_TRACK" | "DELAYED" | "ADVANCED";

export interface ChildDevelopmentMilestone {
  id: number;
  childRegistrationId: number;
  milestoneType: MilestoneType;
  ageCategory: string;
  milestoneTitle: string;
  status: MilestoneStatus;
  assessmentDate: string;
  observations?: string | null;
  evaluatorId?: number | null;
  evaluator?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  } | null;
  createdAt: string;
}

export interface ChildGrowthPhoto {
  id: number;
  childRegistrationId: number;
  photoUrl: string;
  photoDate: string;
  approximateAgeMonths?: number | null;
  isPrimaryPortrait: boolean;
  caption?: string | null;
  uploadedById?: number | null;
  uploadedBy?: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
  createdAt: string;
}

export type TracingMethod =
  | "PUBLIC_BROADCAST"
  | "POLICE_REPORT"
  | "COMMUNITY_INQUIRY"
  | "DATABASE_CROSSMATCH"
  | "PHYSICAL_SEARCH";

export type TracingOutcome =
  | "IN_PROGRESS"
  | "PARENTS_LOCATED"
  | "DECEASED"
  | "UNTRACEABLE";

export interface FamilyTracingLog {
  id: number;
  childRegistrationId: number;
  searchMethod: TracingMethod;
  conductedAt: string;
  location?: string | null;
  findings: string;
  outcome: TracingOutcome;
  documents?: Array<{ fileName: string; fileUrl: string }> | any;
  investigatorId?: number | null;
  investigator?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  } | null;
  createdAt: string;
}

// =====================================================================
// PHASE 2 TYPES: Biometrics, Adera Custody & Facility Census Audits
// =====================================================================

export interface IdentifyingMark {
  type: "SCAR" | "BIRTHMARK" | "TATTOO" | "OTHER";
  location: string;
  description: string;
}

export interface ChildBiometricRecord {
  id: number;
  childRegistrationId: number;
  facialPhotoUrl?: string | null;
  photoHash?: string | null;
  facialEmbedding?: any;
  identifyingMarks: IdentifyingMark[];
  biometricConsent: boolean;
  capturedAt?: string | null;
  capturedById?: number | null;
  capturedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  } | null;
}

export interface DuplicateChildCandidate {
  childId: number;
  name: string;
  currentStatus: string;
  facilityName: string | null;
  matchReason: string;
  confidence: number;
  facialPhotoUrl: string | null;
}

export interface DuplicateCheckResult {
  queryChecked: any;
  potentialDuplicateCount: number;
  isLikelyDuplicate: boolean;
  candidates: DuplicateChildCandidate[];
}

export type AderaStatus =
  | "ACTIVE"
  | "UNDER_SAFETY_REVIEW"
  | "CONVERTED_TO_GUARDIANSHIP"
  | "CONVERTED_TO_ADOPTION"
  | "TERMINATED";

export interface AderaWelfareCheckup {
  id: number;
  aderaRecordId: number;
  visitedById: number;
  visitedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  };
  visitDate: string;
  livingConditionRating: "EXCELLENT" | "GOOD" | "SATISFACTORY" | "NEEDS_IMPROVEMENT" | "CRITICAL";
  safetyAssessment: "SAFE" | "MINOR_CONCERNS" | "MAJOR_CONCERNS" | "UNSAFE";
  childSchoolingStatus: string;
  childHealthStatus: string;
  riskFlags?: string[];
  socialWorkerRemarks: string;
  safetyRecommendation: string;
  createdAt: string;
}

export interface AderaCustodyRecord {
  id: number;
  childRegistrationId: number;
  custodianId: number;
  custodian?: Client;
  relationshipToChild?: string | null;
  reasonForAdera: string;
  custodyAgreementDocUrl?: string | null;
  monthlyStipend?: number | null;
  isCourtApproved: boolean;
  status: AderaStatus;
  formalizedAt: string;
  nextCheckupDue: string;
  notes?: string | null;
  welfareCheckups?: AderaWelfareCheckup[];
  createdAt: string;
  updatedAt: string;
}

export type AuditStatus = "IN_PROGRESS" | "COMPLETED" | "DISCREPANCY_FLAGGED" | "RESOLVED";

export interface FacilityCensusAudit {
  id: number;
  facilityId: number;
  facility?: {
    id: number;
    name: string;
    licensedCapacity: number;
    operationalStatus: string;
    subcity?: string;
  };
  auditorId: number;
  auditor?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  };
  auditDate: string;
  rosterChildCount: number;
  physicalHeadcount: number;
  discrepancyCount: number;
  status: AuditStatus;
  notes?: string | null;
  findings?: {
    unaccountedChildren?: Array<{ childId: number; name: string }>;
    unregisteredChildrenCount?: number;
    notes?: string;
  } | any;
  createdAt: string;
}

export interface FacilityCapacityOverview {
  facilityId: number;
  facilityName: string;
  licensedCapacity: number;
  activeChildrenCount: number;
  occupancyRate: number;
  operationalStatus: string;
  lastInspectedAt: string | null;
  latestAudit: FacilityCensusAudit | null;
}

// =====================================================================
// Phase 3: Intelligent Matching, Suitability & Committee Types
// =====================================================================

export type CommitteeDecision =
  | "APPROVED"
  | "CONDITIONAL_APPROVAL"
  | "DEFERRED"
  | "REJECTED";

export interface FamilySuitabilityAssessment {
  id?: number;
  applicationId: number;
  housingScore: number;
  financialStabilityScore: number;
  psychosocialReadinessScore: number;
  communitySupportScore: number;
  compositeSuitabilityScore: number;
  specialNeedsWillingness: boolean;
  siblingGroupWillingness: boolean;
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  preferredGender?: "MALE" | "FEMALE" | null;
  strengthsNarrative?: string | null;
  riskFactorsNarrative?: string | null;
  assessmentRemarks?: string | null;
  assessedById?: number;
  assessor?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  };
  assessedAt?: string;
}

export interface MatchRecommendationCandidate {
  childId: number;
  childRegistrationId: number;
  facilityChildId: string | null;
  firstName: string;
  lastName: string;
  gender: string | null;
  ageYears: number | null;
  dateOfBirth: string | null;
  facilityName: string | null;
  inSiblingGroup: boolean;
  siblingCount: number;
  hasSpecialNeeds: boolean;
  matchScore: number; // 0 - 100%
  breakdown: {
    ageFitScore: number;
    genderFitScore: number;
    specialNeedsFitScore: number;
    siblingCapacityScore: number;
    seniorityBonus: number;
  };
  explanationHighlights: string[];
}

export interface CommitteeMember {
  name: string;
  role: string;
  agency: string;
  vote: "APPROVE" | "REJECT" | "ABSTAIN";
}

export interface AdoptionCommitteeReview {
  id: number;
  applicationId: number;
  childRegistrationId: number;
  meetingDate: string;
  committeeMembers: CommitteeMember[];
  decision: CommitteeDecision;
  deliberationNotes: string;
  conditionsPrecedent?: string | null;
  chairedById: number;
  chairedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  };
  createdAt: string;
}

// ─── Phase 4 Judicial & Inter-Regional Transfer Models ───────────────────────

export type CourtCaseStatus =
  | "PETITION_FILED"
  | "EVIDENCE_SUBMITTED"
  | "HEARING_SCHEDULED"
  | "ADDITIONAL_EVIDENCE_REQUESTED"
  | "DECREE_GRANTED"
  | "PETITION_DISMISSED"
  | "APPEALED";

export type RegionalBureau =
  | "ADDIS_ABABA"
  | "OROMIA"
  | "AMHARA"
  | "SOMALI"
  | "TIGRAY"
  | "SIDAMA"
  | "CENTRAL_ETHIOPIA"
  | "SOUTH_ETHIOPIA"
  | "SOUTH_WEST_ETHIOPIA"
  | "AFAR"
  | "BENISHANGUL_GUMUZ"
  | "GAMBELLA"
  | "HARARI"
  | "DIRE_DAWA";

export type InterRegionalTransferStatus =
  | "REQUESTED"
  | "DOCUMENTS_DISPATCHED"
  | "RECEIVED_AT_DESTINATION"
  | "ESCORT_COMPLETED"
  | "CLOSED";

export interface CourtHearingRecord {
  id: number;
  courtCaseId: number;
  hearingDate: string;
  hearingType: string;
  attendees?: Array<{ name: string; role: string }> | null;
  judgeOrders?: string | null;
  postponementReason?: string | null;
  nextHearingDate?: string | null;
  recordedById: number;
  recordedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  };
  createdAt: string;
}

export interface AdoptionVeraLinkage {
  id: number;
  matchId: number;
  veraOfficeBranch: string;
  decreeSubmissionDate: string;
  registrationNumber?: string | null;
  amendedBirthCertNumber: string;
  dateIssued: string;
  originalCertArchived: boolean;
  certificateDocumentUrl?: string | null;
  notes?: string | null;
  processedById: number;
  processedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdoptionCourtCase {
  id: number;
  matchId: number;
  courtName: string;
  benchName?: string | null;
  courtFileNumber: string;
  presidingJudge?: string | null;
  filingDate: string;
  status: CourtCaseStatus;
  statusRemarks?: string | null;
  nextHearingDate?: string | null;
  decreeNumber?: string | null;
  decreeDate?: string | null;
  decreeDocumentUrl?: string | null;
  certifiedCopyUrl?: string | null;
  legalOrdersSummary?: string | null;
  handledById?: number | null;
  handledBy?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  };
  hearings?: CourtHearingRecord[];
  veraLinkage?: AdoptionVeraLinkage | null;
  createdAt: string;
  updatedAt: string;
}

export interface CourtBundleManifest {
  bundleTitle: string;
  compiledAt: string;
  courtFileNumber: string;
  parties: {
    child: {
      fullName: string;
      sex?: string;
      dateOfBirth?: string;
      cityIdNumber?: string;
      placeWhereFound?: string;
      timeWhenFound?: string;
      careFacility?: string;
    };
    prospectiveAdopter: {
      fullName: string;
      cityIdNumber?: string;
      phoneNumber?: string;
      address?: string;
      occupation?: string;
      monthlyIncome?: number;
    };
  };
  evidentiarySections: {
    childMedicalClearance: {
      present: boolean;
      bloodGroup?: string | null;
      summary?: string | null;
    };
    socialWorkerHomeStudy: {
      present: boolean;
      homeVisitDate?: string | null;
    };
    familySuitabilityAssessment: {
      present: boolean;
      compositeScore?: number | null;
      strengths?: string | null;
    };
    placementCommitteeMinutes: {
      present: boolean;
      decision?: string | null;
      deliberation?: string | null;
      chairedBy?: string | null;
    };
    familyTracingStatus: {
      logsCount: number;
      reunificationExhausted: boolean;
    };
    siblingIntegrity: {
      inSiblingGroup: boolean;
      groupCode?: string | null;
      siblingsCount: number;
    };
  };
}

export interface InterRegionalChildTransfer {
  id: number;
  childRegistrationId: number;
  originRegion: RegionalBureau;
  destinationRegion: RegionalBureau;
  liaisonOfficerName: string;
  liaisonOfficerPhone?: string | null;
  officialLetterNumber: string;
  transferReason: string;
  status: InterRegionalTransferStatus;
  handoverProtocolDocUrl?: string | null;
  notes?: string | null;
  dispatchedById: number;
  dispatchedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
  };
  dispatchedAt: string;
  completedAt?: string | null;
  createdAt: string;
}

