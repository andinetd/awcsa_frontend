import z from "zod";

export const NewChildformSchema = z.object({
  name_by_family: z.string(),
  name_by_care_center: z.string().optional(),
  father_name: z.string().optional(),
  age: z
    .number()
    .int()
    .min(0, "Age cannot be negative")
    .max(100, "Age too high")
    .optional()
    .nullable(),
  gender: z.enum(["male", "female"]),
  admitance_reason: z.string(),
  found_address: z.string(),
  found_subcity: z.string(),
  found_woreda: z.string(),
  additional_information: z.string(),
  found_date: z.date(),
});

export type NewChildformSchemaType = z.infer<typeof NewChildformSchema>;
