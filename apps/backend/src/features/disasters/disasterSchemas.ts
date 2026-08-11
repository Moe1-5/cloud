import {
  DISASTER_SEVERITY_VALUES,
  DISASTER_STATUS_VALUES,
} from "@ddac/shared";
import { z } from "zod";

export const createDisasterSchema = z.object({
  title: z.string().trim().min(3).max(120),

  disasterType: z.string().trim().min(2).max(100),

  location: z.string().trim().min(2).max(200),

  description: z.string().trim().min(10).max(1500),

  severity: z.enum(DISASTER_SEVERITY_VALUES),

  status: z.enum(DISASTER_STATUS_VALUES).default("active"),

  startDate: z.string().min(1),
});

export const updateDisasterSchema = createDisasterSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one field must be provided.",
  }
);

export const disasterIdSchema = z.object({
  id: z.string().uuid(),
});