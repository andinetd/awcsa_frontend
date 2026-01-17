import { z } from "zod";

export const womenProfileSchema = z.object({
  cityIdNumber: z.string().min(1, "City ID number is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  address: z.string().min(5, "Address is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  occupation: z.string().min(1, "Occupation is required"),
  monthlyIncome: z.coerce.number().min(0, "Monthly income must be positive"),
  photoUrl: z.string().optional(),
});

export type WomenProfileSchemaType = z.infer<typeof womenProfileSchema>;
