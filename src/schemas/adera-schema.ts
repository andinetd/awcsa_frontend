import z from "zod";

export const NewAderaSchema = z
  .object({
    cityIdNumber: z.string(),
    educationLevel: z.string(),
    occupation: z.string(),
    monthlyIncome: z.number(),
    partnerCityIdNumber: z.string().optional(),
    facilitatorCityIdNumber: z.string(),
    preferredChildGender: z.enum(["MALE", "FEMALE"]),
    preferredChildMinAge: z
      .number()
      .int()
      .min(0, "Minimum age must me at least 0"),
    preferredChildMaxAge: z.number().int().min(0, "Max age must be atlest 0"),
  })
  .refine((data) => data.preferredChildMinAge <= data.preferredChildMaxAge, {
    error: "Min age can not be larger than max age",
    path: ["preferredChildMaxAge"],
  });

export type NewAderaSchemaType = z.infer<typeof NewAderaSchema>;
