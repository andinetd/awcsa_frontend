import z from "zod";

export const ApplicationStepOneSchema = z.object({
  id: z.instanceof(File).refine((file) => file != null, {
    message: "please select your id",
  }),
  birthCertificate: z.instanceof(File).refine((file) => file != null, {
    message: "please select your birth certificate",
  }),
  income: z.instanceof(File).refine((file) => file != null, {
    message: "please select your income document",
  }),
  cityIdNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  educationLevel: z.enum(["primary", "secondary", "none", "Diploma", "Bachelor", "Master", "Doctorate"]).optional(),
  occupation: z.string().optional(),
  monthlyIncome: z.number().optional(),
  spouseCityIdNumber: z.string().optional(),
  spouseAgreement: z.boolean().optional(),
  preferredChildren: z
    .object({
      ageRange: z.object({ min: z.number().min(0), max: z.number().min(0) }),
      sex: z.enum(["MALE", "FEMALE", "ANY"]),
      number: z.number().min(0),
    })
    .optional(),
});

export const ApplicationStepTwoSchema = z.object({
  medical: z.instanceof(File).refine((file) => file != null, {
    message: "please select medical document",
  }),
  criminalClearance: z.instanceof(File).refine((file) => file != null, {
    message: "please select your criminal clearance",
  }),
  marriageCertificate: z.instanceof(File).refine((file) => file != null, {
    message: "please select your marriage certificate",
  }),
});

export const ApplicationStepThreeSchema = z.object({
  maritalStatus: z.instanceof(File).refine((file) => file != null, {
    message: "please select your marital document",
  }),
  psychologicalWellbeing: z.instanceof(File).refine((file) => file != null, {
    message: "please select your psychological wellbeing document",
  }),
  photo: z.instanceof(File).refine((file) => file != null, {
    message: "please select your photo",
  }),
});

//type
export type ApplicationStepOneType = z.infer<typeof ApplicationStepOneSchema>;
export type ApplicationStepTwoType = z.infer<typeof ApplicationStepTwoSchema>;
export type ApplicationStepThreeType = z.infer<
  typeof ApplicationStepThreeSchema
>;
