import {
  USER_ROLE_VALUES,
  USER_STATUS_VALUES,
} from "@ddac/shared";

import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3)
    .max(150),

  email: z
    .string()
    .trim()
    .email(),

  phoneNumber: z
    .string()
    .trim()
    .min(7)
    .max(30),

  role: z.enum(USER_ROLE_VALUES),

  status: z
    .enum(USER_STATUS_VALUES)
    .default("active"),

  organisation: z
    .string()
    .trim()
    .min(2)
    .max(150),
});

export const updateUserSchema =
  createUserSchema
    .partial()
    .refine(
      (value) =>
        Object.keys(value).length > 0,
      {
        message:
          "At least one field must be provided.",
      }
    );

export const userIdSchema = z.object({
  id: z.string().uuid(),
});