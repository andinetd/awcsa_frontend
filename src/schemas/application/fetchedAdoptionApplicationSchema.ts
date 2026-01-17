export type PreferredChildren = {
  sex?: string;
  number?: number;
  ageRange?: { min?: number; max?: number } | null;
};

export type FormDataShape = {
  address?: string;
  occupation?: string;
  dateOfBirth?: string;
  cityIdNumber?: string;
  monthlyIncome?: number | null;
  educationLevel?: string;
  spouseAgreement?: boolean;
  preferredChildren?: PreferredChildren | null;
  spouseCityIdNumber?: string | null;
  [k: string]: any;
};

export type AdoptionDataShape = {
  id?: number;
  applicantCityIdNumber?: string;
  spouseCityIdNumber?: string | null;
  educationLevel?: string;
  occupation?: string;
  monthlyIncome?: number | null;
  spouseAgreement?: boolean;
  eligibleDate?: string | null;
  preferredChildren?: PreferredChildren | null;
  homeVisit?: any;
  remark?: string | null;
  createdAt?: string;
  updatedAt?: string;
  serviceDataId?: number;
  [k: string]: any;
};

export type FetchedFile = {
  publicId: string;
  fileName: string;
  fieldName: string;
  fileType?: string;
};

export type FetchedAdoptionApplication = {
  id: number;
  status: string;
  remark?: string | null;
  resubmissionCount?: number;
  createdAt?: string;
  updatedAt?: string;
  fieldComments?: any | null;
  formData?: FormDataShape;
  adoptionData?: AdoptionDataShape;
  client?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    [k: string]: any;
  };
  files?: FetchedFile[];
  [k: string]: any;
};
