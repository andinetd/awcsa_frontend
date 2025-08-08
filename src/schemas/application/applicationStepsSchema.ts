import z from "zod";

export const ApplicationStepOneSchema = z.object({
  id: z.instanceof(File).refine((file) => file != null, {
    message: "please select your id",
  }),
  birthCertificate: z.instanceof(File).refine((file) => file != null, {
    message: "please select your birth certificate",
  }),
  income: z.instanceof(File).refine((file) => file != null, {
    message: "please select your birth certificate",
  }),
});

export const ApplicationStepTwoSchema = z.object({
  medical: z.instanceof(File).refine((file) => file != null, {
    message: "please select your id",
  }),
  criminalClearance: z.instanceof(File).refine((file) => file != null, {
    message: "please select your birth certificate",
  }),
  spouseAgreement: z.instanceof(File).refine((file) => file != null, {
    message: "please select your birth certificate",
  }),
});

//type
export type ApplicationStepOneType = z.infer<typeof ApplicationStepOneSchema>;
export type ApplicationStepTwoType = z.infer<typeof ApplicationStepTwoSchema>;
