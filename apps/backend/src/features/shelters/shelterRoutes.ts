import { Router } from "express";

import {
  createShelter,
  deleteShelter,
  getShelterById,
  listShelters,
  updateShelter,
} from "./shelterRepository.js";

import {
  createShelterSchema,
  shelterIdSchema,
  updateShelterSchema,
} from "./shelterSchemas.js";

export const shelterRouter = Router();

shelterRouter.get("/", async (_request, response, next) => {
  try {
    const shelters = await listShelters();

    response.json({
      data: shelters,
    });
  } catch (error) {
    next(error);
  }
});

shelterRouter.post("/", async (request, response, next) => {
  try {
    const input = createShelterSchema.parse(request.body);

    const shelter = await createShelter(input);

    response.status(201).json({
      data: shelter,
    });
  } catch (error) {
    next(error);
  }
});

shelterRouter.get("/:id", async (request, response, next) => {
  try {
    const { id } = shelterIdSchema.parse(request.params);

    const shelter = await getShelterById(id);

    response.json({
      data: shelter,
    });
  } catch (error) {
    next(error);
  }
});

shelterRouter.patch("/:id", async (request, response, next) => {
  try {
    const { id } = shelterIdSchema.parse(request.params);

    const input = updateShelterSchema.parse(
      request.body
    );

    const shelter = await updateShelter(
      id,
      input
    );

    response.json({
      data: shelter,
    });
  } catch (error) {
    next(error);
  }
});

shelterRouter.delete("/:id", async (request, response, next) => {
  try {
    const { id } = shelterIdSchema.parse(request.params);

    await deleteShelter(id);

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});