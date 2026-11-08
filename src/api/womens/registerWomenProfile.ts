import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export interface RegisterWomenProfilePayload {
  faydaId?: string;
  cityIdNumber?: string;
  confirmLink?: boolean;
  fullName?: string;
  firstName: string;
  lastName: string;
  grandfatherName?: string;
  phoneNumber?: string;
  age?: number;
  dateOfBirth?: string;
  address?: string;
  subCity?: string;
  woreda?: string;
  zone?: string;
  block?: string;
  educationLevel: string;
  careerStatus?: string;
  occupation?: string;
  monthlyIncome?: number;
  photoUrl?: string;

  // ── Training Intake Needs ────────────────────────────────────────────────
  wantsTraining?: boolean;
  requestedTrainingTopic?: string;
  postTrainingParticipation?: string;
  desiredSector?: string;
  traineeStatus?: string[];

  // ── Referral for Support Intake Needs ────────────────────────────────────
  wantsSupport?: boolean;
  cooperativeName?: string;
  requestedTechnologyType?: string;
  supportStatus?: string;
  supportMode?: string;
  disabilities?: string[];

  // ── Sensitive Health Assessment ──────────────────────────────────────────
  healthConsent?: boolean;
  healthConditions?: string[];

  // ── Family and Income Status ─────────────────────────────────────────────
  familyStatus?: string;
  incomeStatus?: string;
}

export const registerWomenProfile = async (
  data: RegisterWomenProfilePayload

) => {
  const { token } = useAuthStore.getState();

  try {
    const req = await axios.post(`${BASE_URL}/women/profiles/register`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return req.data;
  } catch (error: any) {
    const err = new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to register profile"
    );
    (err as any).response = error?.response;
    throw err;
  }
};
