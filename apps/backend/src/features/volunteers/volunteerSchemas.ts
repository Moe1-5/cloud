import { VOLUNTEER_AVAILABILITY_VALUES } from "@ddac/shared";
import { z } from "zod";

export const volunteerIdSchema = z.object({ id: z.string().startsWith("volunteer#") });
export const createVolunteerSchema = z.object({ fullName: z.string().trim().min(2).max(120), phoneNumber: z.string().trim().min(7).max(30), skills: z.string().trim().min(2).max(500), availability: z.enum(VOLUNTEER_AVAILABILITY_VALUES).default("available") });
export const updateVolunteerSchema = createVolunteerSchema.partial().extend({ assignedTask: z.string().trim().max(500).optional(), taskLocation: z.string().trim().max(200).optional() }).refine((value) => Object.keys(value).length > 0, { message: "At least one field must be provided." });
