import { Router } from "express";

import {
  createReliefService,
  deleteReliefService,
  getReliefServiceById,
  listReliefServices,
  updateReliefService,
} from "./reliefServiceRepository.js";

import {
  createReliefServiceSchema,
  reliefServiceIdSchema,
  updateReliefServiceSchema,
} from "./reliefServiceSchemas.js";

export const reliefServiceRouter = Router();

reliefServiceRouter.get(
  "/",
  async (_request, response, next) => {
    try {
      const services =
        await listReliefServices();

      response.json({
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }
);

reliefServiceRouter.post(
  "/",
  async (request, response, next) => {
    try {
      const input =
        createReliefServiceSchema.parse(
          request.body
        );

      const service =
        await createReliefService(input);

      response.status(201).json({
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }
);

reliefServiceRouter.get(
  "/:id",
  async (request, response, next) => {
    try {
      const { id } =
        reliefServiceIdSchema.parse(
          request.params
        );

      const service =
        await getReliefServiceById(id);

      response.json({
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }
);

reliefServiceRouter.patch(
  "/:id",
  async (request, response, next) => {
    try {
      const { id } =
        reliefServiceIdSchema.parse(
          request.params
        );

      const input =
        updateReliefServiceSchema.parse(
          request.body
        );

      const service =
        await updateReliefService(
          id,
          input
        );

      response.json({
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }
);

reliefServiceRouter.delete(
  "/:id",
  async (request, response, next) => {
    try {
      const { id } =
        reliefServiceIdSchema.parse(
          request.params
        );

      await deleteReliefService(id);

      response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);