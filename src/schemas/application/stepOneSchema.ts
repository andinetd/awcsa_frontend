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

//type
export type ApplicationStepOneType = z.infer<typeof ApplicationStepOneSchema>;
