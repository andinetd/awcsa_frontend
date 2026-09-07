import { create } from "zustand";

export type BeneficiaryCategory = "ELDERLY" | "DISABLED";

interface BeneficiaryRegisterState {
  open: boolean;
  category: BeneficiaryCategory;
  openDialog: (category: BeneficiaryCategory) => void;
  closeDialog: () => void;
  setCategory: (category: BeneficiaryCategory) => void;
}

export const useBeneficiaryRegisterStore = create<BeneficiaryRegisterState>(
  (set) => ({
    open: false,
    category: "DISABLED",
    openDialog: (category) => set({ open: true, category }),
    closeDialog: () => set({ open: false }),
    setCategory: (category) => set({ category }),
  }),
);
