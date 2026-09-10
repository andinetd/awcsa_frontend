import z from "zod";

export const ApplicationStepOneSchema = z.object({
  id: z.custom<File>((file) => file != null, {
    message: "Please select your ID document",
  }),
  birthCertificate: z.custom<File>((file) => file != null, {
    message: "Please select your birth certificate",
  }),
  income: z.custom<File>((file) => file != null, {
    message: "Please select your income document",
  }),
  cityIdNumber: z
    .string()
    .min(1, { message: "City ID number is required" })
    .max(50, { message: "City ID number must be at most 50 characters" }),
  dateOfBirth: z
    .string()
    .min(1, { message: "Date of birth is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date of birth must be in YYYY-MM-DD format",
    }),
  address: z.string().min(1, { message: "Address is required" }),
  educationLevel: z
    .string()
    .min(1, { message: "Education level is required" }),
  occupation: z.string().min(1, { message: "Occupation is required" }),
  monthlyIncome: z
    .number({ message: "Monthly income is required" })
    .min(0, { message: "Monthly income cannot be negative" }),
  spouseCityIdNumber: z.string().optional(),
  spouseAgreement: z.boolean().optional(),
  preferredChildren: z
    .object({
      ageRange: z
        .object({ min: z.number().min(0), max: z.number().min(0) })
        .optional(),
      sex: z.enum(["MALE", "FEMALE", "ANY"]),
      number: z.number().min(1, "Preferred number of children must be at least 1"),
    })
    .optional(),
});

export const ApplicationStepTwoSchema = z.object({
  medical: z.custom<File>((file) => file != null, {
    message: "Please select medical document",
  }),
  criminalClearance: z.custom<File>((file) => file != null, {
    message: "Please select your criminal clearance document",
  }),
  marriageCertificate: z.custom<File | null | undefined>().optional().nullable(),
});

export const ApplicationStepThreeSchema = z.object({
  maritalStatus: z.custom<File | null | undefined>().optional().nullable(),
  psychologicalWellbeing: z.custom<File>((file) => file != null, {
    message: "Please select your psychological wellbeing document",
  }),
  photo: z.custom<File>((file) => file != null, {
    message: "Please select your applicant photo",
  }),
});

// types
export type ApplicationStepOneType = z.infer<typeof ApplicationStepOneSchema>;
export type ApplicationStepTwoType = z.infer<typeof ApplicationStepTwoSchema>;
export type ApplicationStepThreeType = z.infer<
  typeof ApplicationStepThreeSchema
>;
