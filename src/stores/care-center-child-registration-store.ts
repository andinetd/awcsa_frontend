import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { NewChildformSchemaType } from "@/schemas/new-child-form-schema";

type CareCenterChildFormState = Partial<NewChildformSchemaType> & {
  setData: (data: Partial<NewChildformSchemaType>) => void;
  clearData: () => void;
};

export const useCareCenterChildFormStore = create<CareCenterChildFormState>()(
  persist(
    (set) => ({
      setData: (data) => set(data),
      clearData: () => set({}),
    }),
    {
      name: "care-center-child-info-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
