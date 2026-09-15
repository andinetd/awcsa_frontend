import { z } from "zod";

const trainingFieldEnum = z.enum([
  "AGRICULTURE",
  "BUSINESS",
  "HOTEL_HOSPITALITY",
  "HOUSE_CONSTRUCTION",
  "AUTOMOTIVE",
  "ELECTRICITY",
  "ICT",
  "MUNICIPALITY_ADMIN",
  "ROAD_CONSTRUCTION",
  "AGRO_PROCESSING",
  "FURNITURE_MAKING",
  "TEXTILE_GARMENT",
  "LEATHER_WORK",
  "METAL_WORKING",
  "OTHER",
]);

export const faydaIdSchema = z
  .string()
  .min(4, "Fayda ID must be at least 4 digits")
  .max(32, "Fayda ID must be at most 32 characters")
  .regex(/^[0-9]+$/, "Fayda ID must contain only digits");

export const baseBeneficiarySchema = z.object({
  faydaId: faydaIdSchema,
  cityIdNumber: z.string().optional(),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  grandfatherName: z.string().optional(),
  phoneNumber: z.string().optional(),
  age: z.coerce.number().int().min(0).max(150).optional(),
  dateOfBirth: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  educationLevel: z.string().optional(),
  occupation: z.string().optional(),
  employmentStatus: z.enum(["EMPLOYED", "UNEMPLOYED"]).optional(),
  maritalStatus: z
    .enum(["MARRIED", "UNMARRIED", "DIVORCED", "WIDOWED"])
    .optional(),
  familyMembersCount: z.coerce.number().int().min(0).optional(),
  address: z.string().optional(),
  subCity: z.string().optional(),
  woreda: z.string().optional(),
  zone: z.string().optional(),
  block: z.string().optional(),
  houseNumber: z.string().optional(),
});

export const trainingChoicesSchema = z.object({
  preferredTraining1: trainingFieldEnum.optional(),
  preferredTraining2: trainingFieldEnum.optional(),
  preferredTraining3: trainingFieldEnum.optional(),
  previousTraining: z.boolean().optional(),
  previousProfession: z.string().optional(),
});

export const workplaceSchema = z.object({
  workplaceCondition: z
    .enum(["OWN_PRIVATE", "KEBELE_PUBLIC", "RENTED"])
    .optional(),
  previousSupport: z.string().optional(),
  supportConfirmed: z.boolean().optional(),
});

export const registerElderlyFormSchema = baseBeneficiarySchema
  .merge(trainingChoicesSchema)
  .merge(workplaceSchema)
  .extend({
    requiredSupportType: z.string().optional(),
  });

export const registerDisabledFormSchema = baseBeneficiarySchema
  .merge(trainingChoicesSchema)
  .merge(workplaceSchema)
  .extend({
    disabilityType: z.string().min(1, "Disability type is required"),
    disabilitySeverity: z
      .enum(["MILD", "MODERATE", "SEVERE", "PROFOUND"])
      .optional(),
    cause: z.string().optional(),
    requiresPhysicalAssistance: z.boolean().optional(),
    requiredAssistiveDevice: z.string().optional(),
    otherSupportRequirements: z.string().optional(),
    documentName: z.string().optional(),
    documentUrl: z.string().optional(),
    documentBase64: z.string().optional(),
  });

export type RegisterElderlyFormValues = z.infer<typeof registerElderlyFormSchema>;
export type RegisterDisabledFormValues = z.infer<typeof registerDisabledFormSchema>;

export const eligibilityFormSchema = z.object({
  residencyVerified: z.boolean().default(false),
  residenceEvidence: z.string().optional(),
  communityConfirmation: z.boolean().default(false),
  woredaConfirmation: z.boolean().default(false),
  economicVulnerabilityEvidence: z.string().optional(),
  medicalEvidenceSubmitted: z.boolean().default(false),
  medicalVerificationStatus: z
    .enum(["PENDING", "VERIFIED", "REJECTED"])
    .default("PENDING"),
  verifyingInstitution: z.string().optional(),
  medicalVerificationDate: z.string().optional(),
  remarks: z.string().optional(),
});

export const eligibilityDecisionSchema = z.object({
  decision: z.enum(["ELIGIBLE", "NOT_ELIGIBLE", "PENDING"]),
  decisionNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export type EligibilityFormValues = z.infer<typeof eligibilityFormSchema>;
export type EligibilityDecisionValues = z.infer<typeof eligibilityDecisionSchema>;

export const serviceTypeEnum = z.enum([
  "VOCATIONAL_TRAINING",
  "PHYSICAL_SUPPORT_ASSISTIVE_DEVICE",
  "INSTITUTIONAL_SERVICE",
  "ALLOWANCE_SUBSIDY",
  "LEGAL_COUNSELING",
  "PSYCHOLOGICAL_COUNSELING",
  "COOPERATION_LETTER",
  "MEDICAL_TREATMENT",
]);

export const serviceRequestFormSchema = z
  .object({
    serviceType: serviceTypeEnum,
    serviceDate: z.string().optional(),
    responsibleOffice: z.string().optional(),
    responsibleEmployeeId: z.coerce.number().int().optional(),
    remarks: z.string().optional(),
    subCity: z.string().optional(),
    woreda: z.string().optional(),
    allowance: z
      .object({
        amount: z.coerce.number().positive("Amount must be positive"),
        paymentDate: z.string().min(1, "Payment date is required"),
        paymentPeriod: z.string().optional(),
        referenceNumber: z.string().optional(),
        paymentStatus: z.string().optional(),
        remarks: z.string().optional(),
      })
      .optional(),
    assistiveDevice: z
      .object({
        requestType: z.enum([
          "PHYSICAL_SUPPORT",
          "ASSISTIVE_DEVICE",
          "PROSTHETIC",
          "OTHER",
        ]),
        description: z.string().optional(),
        medicalVerified: z.boolean().optional(),
        serviceProvider: z.string().optional(),
        dateProvided: z.string().optional(),
      })
      .optional(),
    referral: z
      .object({
        destinationInstitution: z.string().min(1, "Destination is required"),
        reason: z.string().optional(),
        requestedService: z.string().optional(),
        letterDate: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.serviceType === "ALLOWANCE_SUBSIDY" && !data.allowance) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["allowance"],
        message: "Allowance details are required",
      });
    }
    if (
      data.serviceType === "PHYSICAL_SUPPORT_ASSISTIVE_DEVICE" &&
      !data.assistiveDevice
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["assistiveDevice"],
        message: "Assistive device details are required",
      });
    }
    if (
      ["COOPERATION_LETTER", "MEDICAL_TREATMENT", "INSTITUTIONAL_SERVICE"].includes(
        data.serviceType
      ) &&
      !data.referral
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["referral"],
        message: "Referral details are required",
      });
    }
  });

export type ServiceRequestFormValues = z.infer<typeof serviceRequestFormSchema>;

export const serviceConfirmSchema = z.object({
  confirmationMethod: z.string().optional(),
  remarks: z.string().optional(),
});

export type ServiceConfirmValues = z.infer<typeof serviceConfirmSchema>;

export const caseNoteSchema = z.object({
  note: z.string().min(1, "Note cannot be empty"),
  category: z.string().optional(),
});

export type CaseNoteFormValues = z.infer<typeof caseNoteSchema>;

export const beneficiarySearchSchema = z.object({
  q: z.string().optional(),
  by: z.enum(["fayda", "name", "phone", "cityId"]).default("fayda"),
  category: z.enum(["ELDERLY", "DISABLED"]).optional(),
  subCity: z.string().optional(),
  woreda: z.string().optional(),
  disabilityType: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(25),
});

export type BeneficiarySearchFormValues = z.infer<typeof beneficiarySearchSchema>;
