import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

export interface ImportRowIssue {
  severity: "error" | "warning" | "info";
  field?: string;
  message: string;
}

export interface ImportWorkbookSummary {
  edirSheetTotal: number;
  contributionSheetTotal: number;
  beneficiarySheetTotal: number;
  matchedEdirs: number;
  unmatchedEdirs: number;
  totalDuplicates: number;
  totalIssues: number;
  duplicateEdirs: number;
  duplicateContributions: number;
  duplicateBeneficiaries: number;
}

export interface ParsedEdirRecord {
  name: string;
  subCity: string;
  woreda: string;
  ketena?: string | null;
  block?: string | null;
  establishmentDate?: string | Date | null;
  edirType: string;
  totalAssetValue?: number | null;
  generalMale?: number;
  generalFemale?: number;
  chairpersonName?: string | null;
  chairpersonPhone?: string | null;
  hasOwnPremises?: boolean;
  premisesTenureType?: string;
  hasMapOrDocument?: boolean;
  permitFee?: number | null;
  additionalIncome?: string | null;
  isDuplicate?: boolean;
  duplicateReason?: string | null;
  issues?: ImportRowIssue[];
  [key: string]: any;
}

export interface ParsedContributionRecord {
  edirAssociationId?: number | null;
  edirNameRaw: string;
  subCity: string;
  woreda: string;
  chairpersonName?: string | null;
  chairpersonPhone?: string | null;
  fiscalYear: number;
  quarter: number;
  contributionCategory: string;
  itemDescription?: string | null;
  monetaryEquivalentBirr?: number | null;
  targetMaleCount?: number;
  targetFemaleCount?: number;
  targetTotalCount?: number;
  inspectionNotes?: string | null;
  inspectionStatus?: string;
  status?: string;
  isDuplicate?: boolean;
  duplicateReason?: string | null;
  issues?: ImportRowIssue[];
  [key: string]: any;
}

export interface ParsedBeneficiaryRecord {
  edirAssociationId?: number | null;
  edirContributionId?: number | null;
  supportingEdirNameRaw?: string | null;
  beneficiaryName: string;
  sex?: string | null;
  phoneNumber?: string | null;
  subCity: string;
  woreda: string;
  ketena?: string | null;
  vulnerabilityStatus?: string | null;
  supportModality?: string;
  itemDetails?: string | null;
  totalValueBirr?: number | null;
  isDuplicate?: boolean;
  duplicateReason?: string | null;
  issues?: ImportRowIssue[];
  [key: string]: any;
}

export interface ImportWorkbookResult {
  dryRun: boolean;
  summary: ImportWorkbookSummary;
  parsedEdirs: ParsedEdirRecord[];
  parsedContributions: ParsedContributionRecord[];
  parsedBeneficiaries: ParsedBeneficiaryRecord[];
}

export const previewEdirImport = async (
  file: File
): Promise<ImportWorkbookResult> => {
  const { token } = useAuthStore.getState();
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${BASE_URL}/edir/reports/import/associations?dryRun=true`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to preview import";
    throw new Error(message);
  }
};

export const importEdirAssociations = async (
  file: File
): Promise<ImportWorkbookResult> => {
  const { token } = useAuthStore.getState();
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${BASE_URL}/edir/reports/import/associations?dryRun=false`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to import file";
    throw new Error(message);
  }
};
