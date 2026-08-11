import { Router } from "express";
import { z } from "zod";
import { AppError } from "../../shared/errors.js";
import {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  updateProject
} from "./projectRepository.js";
import { createProjectSchema, projectIdSchema, updateProjectSchema } from "./projectSchemas.js";

export const projectRouter = Router();

projectRouter.get("/", async (_request, response, next) => {
  try {
    const projects = await listProjects();
    response.json({ data: projects });
  } catch (error) {
    next(error);
  }
});

projectRouter.post("/", async (request, response, next) => {
  try {
    const input = createProjectSchema.parse(request.body);
    const project = await createProject(input);
    response.status(201).json({ data: project });
  } catch (error) {
    next(error);
  }
});

projectRouter.get("/:id", async (request, response, next) => {
  try {
    const { id } = projectIdSchema.parse(request.params);
    const project = await getProjectById(id);
    response.json({ data: project });
  } catch (error) {
    next(error);
  }
});

projectRouter.patch("/:id", async (request, response, next) => {
  try {
    const { id } = projectIdSchema.parse(request.params);
    const input = updateProjectSchema.parse(request.body);
    const project = await updateProject(id, input);
    response.json({ data: project });
  } catch (error) {
    next(error);
  }
});

projectRouter.delete("/:id", async (request, response, next) => {
  try {
    const { id } = projectIdSchema.parse(request.params);
    await deleteProject(id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

export function normalizeApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof z.ZodError) {
    return new AppError("Request validation failed.", 400, error.flatten());
  }

  if (typeof error === "object" && error !== null && "name" in error) {
    const name = String(error.name);
    if (name === "ConditionalCheckFailedException") {
      return new AppError("The requested project does not exist.", 404);
    }
  }

  return new AppError("Unexpected server error.", 500);
}
