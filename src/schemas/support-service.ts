import { z } from "zod";

export const supportServiceSchema = z
  .object({
    serviceTypeId: z.number().min(1, "Service type is required"),
    clientId: z.number().optional(),
    womenAssociationId: z.number().optional(),
    provider: z.string().min(1, "Provider is required"),
    amountOrQuantity: z.string().min(1, "Amount or quantity is required"),
    dateProvided: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date",
    }),
    facilitatorCityId: z.string().min(1, "Facilitator City ID is required"),
    subCity: z.string().min(1, "Sub-city is required"),
    woreda: z.string().min(1, "Woreda is required"),
    remark: z.string().optional(),
  })
  .refine((data) => data.clientId || data.womenAssociationId, {
    message: "You must provide either a Client ID or a Women Association ID",
    path: ["clientId"],
  });

export const monitoringSchema = z.object({
  supportRecordId: z.number().min(1, "Support record ID is required"),
  monitoringDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  assessedBy: z.string().min(1, "Assessor name is required"),
  currentStatus: z.string().min(1, "Status is required"),
  score: z.coerce.number().min(0, "Score must be at least 0"),
  remark: z.string().min(1, "Remark is required"),
});

export const combinedRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  cityIdNumber: z.string().min(1, "City ID number is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  occupation: z.string().min(1, "Occupation is required"),
  serviceTypeId: z.number().min(1, "Service type is required"),
  provider: z.string().min(1, "Provider is required"),
  amountOrQuantity: z.string().min(1, "Amount or quantity is required"),
  dateProvided: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  subCity: z.string().min(1, "Sub-city is required"),
  woreda: z.string().min(1, "Woreda is required"),
  facilitatorCityId: z.string().min(1, "Facilitator City ID is required"),
  remark: z.string().optional(),
});

export type SupportServiceSchemaType = z.infer<typeof supportServiceSchema>;
export type MonitoringSchemaType = z.infer<typeof monitoringSchema>;
export type CombinedRegistrationSchemaType = z.infer<
  typeof combinedRegistrationSchema
>;
