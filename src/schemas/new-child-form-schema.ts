import z from "zod";

export const NewChildformSchema = z.object({
  name_by_family: z.string().trim().optional(),
  name_by_care_center: z.string().trim().min(1, "Name is required"),
  father_name: z.string().trim().optional(),
  age: z
    .number()
    .int()
    .min(0, "Age cannot be negative")
    .max(100, "Age too high")
    .nullable()
    .optional(),
  gender: z.enum(["male", "female"]),
  admitance_reason: z.string().trim().optional(),
  found_address: z.string().trim().optional(),
  found_subcity: z.string().trim().optional(),
  found_woreda: z.string().trim().optional(),
  additional_information: z.string().trim().optional(),

  found_date: z.date(),

  child_founder_name: z.string().optional(),
  child_founder_address: z.string().optional(),
  child_founder_subcity: z.string().optional(),
  child_found_woreda: z.string().optional(),
  child_founder_house_no: z.number().int().min(0).optional(),
  child_founder_phone: z.string().optional(),

  officer_name: z.string().optional(),
  officer_responsibility: z.string().optional(),
  officer_address: z.string().optional(),
  officer_subcity: z.string().optional(),
  officer_woreda: z.string().optional(),
  officer_phone: z.string().optional(),
  officer_id_no: z.string().optional(),

  care_center_worker_responsibility: z.string().optional(),
  care_center_worker_address: z.string().optional(),
  care_center_worker_subcity: z.string().optional(),
  care_center_worker_woreda: z.string().optional(),
  care_center_worker_phone: z.string().optional(),
  care_center_worker_id_no: z.string().optional(),
  care_center_worker_name: z.string().optional(),

  health_officer_1_name: z.string().optional(),
  heallth_officer_2_name: z.string().optional(),
});

export const NewChildformSchemaSection1 = NewChildformSchema.pick({
  name_by_family: true,
  name_by_care_center: true,
  father_name: true,
  age: true,

  gender: true,
  admitance_reason: true,
  found_address: true,
  found_subcity: true,
  found_woreda: true,
  additional_information: true,
  found_date: true,
});

export const NewChildformSchemaSection2 = NewChildformSchema.pick({
  child_founder_name: true,
  child_founder_address: true,
  child_found_woreda: true,
  child_founder_house_no: true,
  child_founder_phone: true,
  child_founder_subcity: true,
  officer_address: true,
  officer_id_no: true,
  officer_name: true,
  officer_phone: true,
  officer_responsibility: true,
  officer_subcity: true,
  officer_woreda: true,
  care_center_worker_address: true,
  care_center_worker_id_no: true,
  care_center_worker_phone: true,
  care_center_worker_responsibility: true,
  care_center_worker_subcity: true,
  care_center_worker_woreda: true,
  care_center_worker_name: true,

  health_officer_1_name: true,
  heallth_officer_2_name: true,
});

export type NewChildformSchemaType = z.infer<typeof NewChildformSchema>;
export type NewChildformTypeSection1 = z.infer<
  typeof NewChildformSchemaSection1
>;
export type NewChildformTypeSection2 = z.infer<
  typeof NewChildformSchemaSection2
>;
