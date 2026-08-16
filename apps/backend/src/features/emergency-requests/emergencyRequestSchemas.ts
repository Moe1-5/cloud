import {
  ASSISTANCE_TYPE_VALUES,
  EMERGENCY_PRIORITY_VALUES,
  EMERGENCY_REQUEST_STATUS_VALUES
} from "@ddac/shared";
import { z } from "zod";

const affectedRequestFields = {
  assistanceType: z.enum(ASSISTANCE_TYPE_VALUES),
  description: z.string().trim().min(10).max(1500),
  location: z.string().trim().min(3).max(300),
  peopleAffected: z.number().int().positive().max(1000)
};

export const createEmergencyRequestSchema = z.object({
  requesterId: z.string().uuid(),
  ...affectedRequestFields
});

export const updateEmergencyRequestSchema = z
  .object({
    requesterId: z.string().uuid(),
    assistanceType: affectedRequestFields.assistanceType.optional(),
    description: affectedRequestFields.description.optional(),
    location: affectedRequestFields.location.optional(),
    peopleAffected: affectedRequestFields.peopleAffected.optional()
  })
  .refine((value) => Object.keys(value).some((key) => key !== "requesterId"), {
    message: "At least one request detail must be provided."
  });

export const cancelEmergencyRequestSchema = z.object({
  requesterId: z.string().uuid()
});

export const coordinatorEmergencyUpdateSchema = z
  .object({
    priority: z.enum(EMERGENCY_PRIORITY_VALUES).optional(),
    status: z.enum(EMERGENCY_REQUEST_STATUS_VALUES).optional(),
    assignedTo: z.string().trim().min(2).max(160).optional(),
    coordinatorNotes: z.string().trim().max(1500).optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one coordinator field must be provided."
  });

export const emergencyRequestIdSchema = z.object({
  id: z.string().uuid()
});

export const emergencyRequestQuerySchema = z.object({
  requesterId: z.string().uuid().optional()
});
