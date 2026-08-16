import { DISTRIBUTION_STATUS_VALUES } from "@ddac/shared";
import { z } from "zod";

export const createDistributionSchema = z.object({
  resourceId: z.string().uuid(),
  quantity: z.number().finite().positive(),
  destination: z.string().trim().min(2).max(200),
  recipient: z.string().trim().min(2).max(160),
  scheduledAt: z.string().datetime(),
  notes: z.string().trim().max(1000).optional()
});

export const updateDistributionStatusSchema = z.object({
  status: z.enum(DISTRIBUTION_STATUS_VALUES)
});

export const distributionIdSchema = z.object({
  id: z.string().uuid()
});
