import { VICTIM_STATUS_VALUES } from "@ddac/shared";
import { z } from "zod";

export const victimIdSchema = z.object({ id: z.string().startsWith("victim#") });
export const createVictimSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  identificationNumber: z.string().trim().min(4).max(40),
  phoneNumber: z.string().trim().min(7).max(30),
  location: z.string().trim().min(2).max(200),
  assistanceNeeds: z.string().trim().min(3).max(1000),
  status: z.enum(VICTIM_STATUS_VALUES).default("registered")
});
export const updateVictimSchema = createVictimSchema.omit({ identificationNumber: true }).partial().refine((value) => Object.keys(value).length > 0, { message: "At least one field must be provided." });
export const addAssistanceSchema = z.object({
  description: z.string().trim().min(3).max(1000),
  providedBy: z.string().trim().min(2).max(120)
});
