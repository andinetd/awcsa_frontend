import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { NewChildformSchemaType } from "@/schema/new-child-form-schema";

type NewChildformState = Partial<NewChildformSchemaType> & {
  setData: (data: Partial<NewChildformSchemaType>) => void;
};

export const useNewChildFormStore = create<NewChildformState>()(
  persist(
    (set) => ({
      setData: (data) => set(data),
    }),
    {
      name: "new-child-info-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
