import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

export const registerAffectedUserSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
  phone: z.string().trim().min(7).max(30),
  address: z.string().trim().min(5).max(300),
  householdSize: z.coerce.number().int().positive().max(100),
  emergencyContact: z.string().trim().min(7).max(160)
});
