import { Router } from "express";
import {
  createAffectedUserProfile,
  getAffectedUserProfileById,
  listAffectedUserProfiles,
  updateAffectedUserProfile
} from "./affectedUserProfileRepository.js";
import {
  affectedUserProfileIdSchema,
  createAffectedUserProfileSchema,
  updateAffectedUserProfileSchema
} from "./affectedUserProfileSchemas.js";

export const affectedUserProfileRouter = Router();

affectedUserProfileRouter.get("/", async (_request, response, next) => {
  try {
    response.json({ data: await listAffectedUserProfiles() });
  } catch (error) {
    next(error);
  }
});

affectedUserProfileRouter.post("/", async (request, response, next) => {
  try {
    const input = createAffectedUserProfileSchema.parse(request.body);
    response.status(201).json({ data: await createAffectedUserProfile(input) });
  } catch (error) {
    next(error);
  }
});

affectedUserProfileRouter.get("/:id", async (request, response, next) => {
  try {
    const { id } = affectedUserProfileIdSchema.parse(request.params);
    response.json({ data: await getAffectedUserProfileById(id) });
  } catch (error) {
    next(error);
  }
});

affectedUserProfileRouter.patch("/:id", async (request, response, next) => {
  try {
    const { id } = affectedUserProfileIdSchema.parse(request.params);
    const input = updateAffectedUserProfileSchema.parse(request.body);
    response.json({ data: await updateAffectedUserProfile(id, input) });
  } catch (error) {
    next(error);
  }
});
