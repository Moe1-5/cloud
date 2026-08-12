import { RESOURCE_CATEGORY_VALUES } from "@ddac/shared";
import { z } from "zod";

export const createResourceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.enum(RESOURCE_CATEGORY_VALUES),
  quantity: z.number().finite().nonnegative(),
  unit: z.string().trim().min(1).max(40),
  location: z.string().trim().min(2).max(200),
  reorderLevel: z.number().finite().nonnegative()
});

export const updateResourceSchema = createResourceSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided."
  });

export const resourceIdSchema = z.object({
  id: z.string().uuid()
});
