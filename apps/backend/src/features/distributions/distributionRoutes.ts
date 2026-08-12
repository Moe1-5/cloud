import { Router } from "express";
import {
  createDistribution,
  getDistributionById,
  listDistributions,
  updateDistributionStatus
} from "./distributionRepository.js";
import {
  createDistributionSchema,
  distributionIdSchema,
  updateDistributionStatusSchema
} from "./distributionSchemas.js";

export const distributionRouter = Router();

distributionRouter.get("/", async (_request, response, next) => {
  try {
    response.json({ data: await listDistributions() });
  } catch (error) {
    next(error);
  }
});

distributionRouter.post("/", async (request, response, next) => {
  try {
    const input = createDistributionSchema.parse(request.body);
    response.status(201).json({ data: await createDistribution(input) });
  } catch (error) {
    next(error);
  }
});

distributionRouter.get("/:id", async (request, response, next) => {
  try {
    const { id } = distributionIdSchema.parse(request.params);
    response.json({ data: await getDistributionById(id) });
  } catch (error) {
    next(error);
  }
});

distributionRouter.patch("/:id/status", async (request, response, next) => {
  try {
    const { id } = distributionIdSchema.parse(request.params);
    const { status } = updateDistributionStatusSchema.parse(request.body);
    response.json({ data: await updateDistributionStatus(id, status) });
  } catch (error) {
    next(error);
  }
});
