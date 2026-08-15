import {
  ORGANISATION_STATUS_VALUES,
} from "@ddac/shared";

import { z } from "zod";

export const createOrganisationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3)
    .max(150),

  organisationType: z
    .string()
    .trim()
    .min(2)
    .max(100),

  address: z
    .string()
    .trim()
    .min(5)
    .max(300),

  contactNumber: z
    .string()
    .trim()
    .min(7)
    .max(30),

  email: z
    .string()
    .trim()
    .email(),

  status: z
    .enum(ORGANISATION_STATUS_VALUES)
    .default("active"),
});

export const updateOrganisationSchema =
  createOrganisationSchema
    .partial()
    .refine(
      (value) =>
        Object.keys(value).length > 0,
      {
        message:
          "At least one field must be provided.",
      }
    );

export const organisationIdSchema =
  z.object({
    id: z.string().uuid(),
  });