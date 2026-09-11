import { z } from "zod";

export const womenProfileSchema = z.object({
  cityIdNumber: z.string().min(1, "City ID number is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  age: z.coerce.number().int().min(1, "Age must be at least 1").max(130, "Age must be valid"),
  dateOfBirth: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  careerStatus: z.string().min(1, "Career status is required"),
  occupation: z.string().optional(),
  monthlyIncome: z.coerce.number().optional(),
  photoUrl: z.string().optional(),
});

export type WomenProfileSchemaType = z.infer<typeof womenProfileSchema>;
