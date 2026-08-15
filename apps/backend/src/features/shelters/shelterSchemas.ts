import { SHELTER_STATUS_VALUES } from "@ddac/shared";
import { z } from "zod";

export const createShelterSchema = z.object({
  name: z.string().trim().min(3).max(150),
  location: z.string().trim().min(3).max(250),

  capacity: z.number().int().min(1),

  currentOccupancy: z.number().int().min(0),

  contactNumber: z.string().trim().min(7).max(30),

  status: z.enum(SHELTER_STATUS_VALUES).default("open"),

  notes: z.string().trim().max(1000),
});

export const updateShelterSchema = createShelterSchema
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    {
      message: "At least one field must be provided.",
    }
  );

export const shelterIdSchema = z.object({
  id: z.string().uuid(),
});