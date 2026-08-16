import { Router } from "express";
import { z } from "zod";

import { AppError } from "../../shared/errors.js";

import {
  createDisaster,
  deleteDisaster,
  getDisasterById,
  listDisasters,
  updateDisaster,
} from "./disasterRepository.js";

import {
  createDisasterSchema,
  disasterIdSchema,
  updateDisasterSchema,
} from "./disasterSchemas.js";

export const disasterRouter = Router();

disasterRouter.get("/", async (_request, response, next) => {
  try {
    const disasters = await listDisasters();
    response.json({ data: disasters });
  } catch (error) {
    next(error);
  }
});

disasterRouter.post("/", async (request, response, next) => {
  try {
    const input = createDisasterSchema.parse(request.body);
    const disaster = await createDisaster(input);

    response.status(201).json({ data: disaster });
  } catch (error) {
    next(error);
  }
});

disasterRouter.get("/:id", async (request, response, next) => {
  try {
    const { id } = disasterIdSchema.parse(request.params);
    const disaster = await getDisasterById(id);

    response.json({ data: disaster });
  } catch (error) {
    next(error);
  }
});

disasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const { id } = disasterIdSchema.parse(request.params);
    const input = updateDisasterSchema.parse(request.body);
    const disaster = await updateDisaster(id, input);

    response.json({ data: disaster });
  } catch (error) {
    next(error);
  }
});

disasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const { id } = disasterIdSchema.parse(request.params);

    await deleteDisaster(id);

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

export function normalizeDisasterApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof z.ZodError) {
    return new AppError(
      "Request validation failed.",
      400,
      error.flatten()
    );
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error
  ) {
    const name = String(error.name);

    if (name === "ConditionalCheckFailedException") {
      return new AppError(
        "The requested disaster does not exist.",
        404
      );
    }
  }

  return new AppError("Unexpected server error.", 500);
}