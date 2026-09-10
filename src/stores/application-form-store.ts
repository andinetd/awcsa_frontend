import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ApplicationStepOneType,
  ApplicationStepTwoType,
  ApplicationStepThreeType,
} from "@/schemas/application/applicationStepsSchema";


export type Step1Data = ApplicationStepOneType | null;
export type Step2Data = ApplicationStepTwoType | null;
export type Step3Data = ApplicationStepThreeType | null;

interface ApplicationFormState {
  step1: Step1Data | null;
  step2: Step2Data | null;
  step3: Step3Data | null;
  setStep1: (data: Step1Data) => void;
  setStep2: (data: Step2Data) => void;
  setStep3: (data: Step3Data) => void;
  reset: () => void;
}

export const useApplicationFormStore = create<ApplicationFormState>()(
  persist(
    (set) => ({
      step1: null,
      step2: null,
      step3: null,
      setStep1: (data) => set({ step1: data }),
      setStep2: (data) => set({ step2: data }),
      setStep3: (data) => set({ step3: data }),
      reset: () => set({ step1: null, step2: null, step3: null }),
    }),
    {
      name: "application-form-store",
      // Exclude File objects from localStorage JSON serialization to prevent them from turning into empty objects {}
      partialize: (state) => ({
        step1: state.step1
          ? {
              ...state.step1,
              id: undefined as any,
              birthCertificate: undefined as any,
              income: undefined as any,
            }
          : null,
        step2: state.step2
          ? {
              ...state.step2,
              medical: undefined as any,
              criminalClearance: undefined as any,
              marriageCertificate: undefined as any,
            }
          : null,
        step3: state.step3
          ? {
              ...state.step3,
              maritalStatus: undefined as any,
              psychologicalWellbeing: undefined as any,
              photo: undefined as any,
            }
          : null,
      }),
    }
  )
);
