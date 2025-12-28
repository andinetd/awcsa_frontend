export interface Edir {
  id?: number;
  name: string;
  establishmentDate: string;
  formationMethod: "GOVERNMENT_ISSUED" | "WILL_OF_PEOPLE" | string;
  subCity: string;
  woreda: string;
  kebele: string;
  houseNumber: string;
  specificLocation: string;
  // Flat member fields
  managementMale: number;
  managementFemale: number;
  generalMale: number;
  generalFemale: number;
  // Array of strings for reasons
  establishmentReasons: string[];
  bankAccountNumber: string;
  monthlyPaymentDetails: string;
  remark?: string;
  regulationsDocId?: number;
  status?: "ACTIVE" | "INACTIVE";
  otherReasonDescription?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    members: number;
  };
}
