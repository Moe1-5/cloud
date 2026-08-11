import { PROJECT_STATUS_VALUES } from "@ddac/shared";
import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(1000),
  ownerName: z.string().trim().min(2).max(120),
  status: z.enum(PROJECT_STATUS_VALUES).default("planning")
});

export const updateProjectSchema = createProjectSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one field must be provided."
  }
);

export const projectIdSchema = z.object({
  id: z.string().uuid()
});
