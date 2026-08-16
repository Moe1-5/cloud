import {
  RELIEF_SERVICE_STATUS_VALUES,
  RELIEF_SERVICE_TYPE_VALUES,
} from "@ddac/shared";

import { z } from "zod";

export const createReliefServiceSchema = z.object({
  name: z.string().trim().min(3).max(150),

  serviceType: z.enum(
    RELIEF_SERVICE_TYPE_VALUES
  ),

  location: z.string().trim().min(3).max(250),

  description: z.string().trim().min(5).max(1200),

  contactNumber: z.string().trim().min(7).max(30),

  operatingHours: z.string().trim().min(2).max(100),

  status: z
    .enum(RELIEF_SERVICE_STATUS_VALUES)
    .default("available"),
});

export const updateReliefServiceSchema =
  createReliefServiceSchema
    .partial()
    .refine(
      (value) => Object.keys(value).length > 0,
      {
        message: "At least one field must be provided.",
      }
    );

export const reliefServiceIdSchema = z.object({
  id: z.string().uuid(),
});