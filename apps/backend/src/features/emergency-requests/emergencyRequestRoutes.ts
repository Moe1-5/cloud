import { Router } from "express";
import {
  cancelEmergencyRequest,
  createEmergencyRequest,
  getEmergencyRequestById,
  listEmergencyRequests,
  updateEmergencyRequest,
  updateEmergencyRequestByCoordinator
} from "./emergencyRequestRepository.js";
import {
  cancelEmergencyRequestSchema,
  coordinatorEmergencyUpdateSchema,
  createEmergencyRequestSchema,
  emergencyRequestIdSchema,
  emergencyRequestQuerySchema,
  updateEmergencyRequestSchema
} from "./emergencyRequestSchemas.js";

export const emergencyRequestRouter = Router();

emergencyRequestRouter.get("/", async (request, response, next) => {
  try {
    const { requesterId } = emergencyRequestQuerySchema.parse(request.query);
    response.json({ data: await listEmergencyRequests(requesterId) });
  } catch (error) {
    next(error);
  }
});

emergencyRequestRouter.post("/", async (request, response, next) => {
  try {
    const input = createEmergencyRequestSchema.parse(request.body);
    response.status(201).json({ data: await createEmergencyRequest(input) });
  } catch (error) {
    next(error);
  }
});

emergencyRequestRouter.get("/:id", async (request, response, next) => {
  try {
    const { id } = emergencyRequestIdSchema.parse(request.params);
    response.json({ data: await getEmergencyRequestById(id) });
  } catch (error) {
    next(error);
  }
});

emergencyRequestRouter.patch("/:id", async (request, response, next) => {
  try {
    const { id } = emergencyRequestIdSchema.parse(request.params);
    const input = updateEmergencyRequestSchema.parse(request.body);
    response.json({ data: await updateEmergencyRequest(id, input) });
  } catch (error) {
    next(error);
  }
});

emergencyRequestRouter.patch("/:id/cancel", async (request, response, next) => {
  try {
    const { id } = emergencyRequestIdSchema.parse(request.params);
    const { requesterId } = cancelEmergencyRequestSchema.parse(request.body);
    response.json({ data: await cancelEmergencyRequest(id, requesterId) });
  } catch (error) {
    next(error);
  }
});

emergencyRequestRouter.patch("/:id/coordinator", async (request, response, next) => {
  try {
    const { id } = emergencyRequestIdSchema.parse(request.params);
    const input = coordinatorEmergencyUpdateSchema.parse(request.body);
    response.json({ data: await updateEmergencyRequestByCoordinator(id, input) });
  } catch (error) {
    next(error);
  }
});
