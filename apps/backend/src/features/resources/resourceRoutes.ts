import { Router } from "express";
import {
  createResource,
  deleteResource,
  getResourceById,
  listResources,
  updateResource
} from "./resourceRepository.js";
import { createResourceSchema, resourceIdSchema, updateResourceSchema } from "./resourceSchemas.js";

export const resourceRouter = Router();

resourceRouter.get("/", async (_request, response, next) => {
  try {
    response.json({ data: await listResources() });
  } catch (error) {
    next(error);
  }
});

resourceRouter.post("/", async (request, response, next) => {
  try {
    const input = createResourceSchema.parse(request.body);
    const resource = await createResource(input);
    response.status(201).json({ data: resource });
  } catch (error) {
    next(error);
  }
});

resourceRouter.get("/:id", async (request, response, next) => {
  try {
    const { id } = resourceIdSchema.parse(request.params);
    response.json({ data: await getResourceById(id) });
  } catch (error) {
    next(error);
  }
});

resourceRouter.patch("/:id", async (request, response, next) => {
  try {
    const { id } = resourceIdSchema.parse(request.params);
    const input = updateResourceSchema.parse(request.body);
    response.json({ data: await updateResource(id, input) });
  } catch (error) {
    next(error);
  }
});

resourceRouter.delete("/:id", async (request, response, next) => {
  try {
    const { id } = resourceIdSchema.parse(request.params);
    await deleteResource(id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});
