import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Step1SchemaType,
  Step2SchemaType,
  Step3SchemaType,
  Step4SchemaType,
  Step5SchemaType,
} from "@/schemas/home-visit-steps-schema";


export type Step1Data = Step1SchemaType | null;
export type Step2Data = Step2SchemaType | null;
export type Step3Data = Step3SchemaType | null;
export type Step4Data = Step4SchemaType | null;
export type Step5Data = Step5SchemaType | null;

interface HomeVisitFormState {
  serviceDataId: string | null;
  step1: Step1Data | null;
  step2: Step2Data | null;
  step3: Step3Data | null;
  step4: Step4Data | null;
  step5: Step5Data | null;
  setServiceDataId: (id: string) => void;
  setStep1: (data: Step1Data) => void;
  setStep2: (data: Step2Data) => void;
  setStep3: (data: Step3Data) => void;
  setStep4: (data: Step4Data) => void;
  setStep5: (data: Step5Data) => void;
  reset: () => void;
}

export const useHomeVisitFormStore = create<HomeVisitFormState>()(
  persist(
    (set) => ({
      serviceDataId: null,
      step1: null,
      step2: null,
      step3: null,
      step4: null,
      step5: null,
      setServiceDataId: (id: string) => set({ serviceDataId: id }),
      setStep1: (data) => set({ step1: data }),
      setStep2: (data) => set({ step2: data }),
      setStep3: (data) => set({ step3: data }),
      setStep4: (data) => set({ step4: data }),
      setStep5: (data) => set({ step5: data }),
      reset: () =>
        set({
          step1: null,
          step2: null,
          step3: null,
          step4: null,
          step5: null,
        }),
    }),
    { name: "Home-visit-store" }
  )
);
