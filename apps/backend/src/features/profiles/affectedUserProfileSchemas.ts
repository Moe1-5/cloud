import { z } from "zod";

export const createAffectedUserProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  address: z.string().trim().min(5).max(300),
  householdSize: z.number().int().positive().max(100),
  emergencyContact: z.string().trim().min(7).max(160)
});

export const updateAffectedUserProfileSchema = createAffectedUserProfileSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided."
  });

export const affectedUserProfileIdSchema = z.object({
  id: z.string().uuid()
});
