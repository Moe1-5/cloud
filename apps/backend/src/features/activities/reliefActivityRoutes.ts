import { Router } from "express";
import { getReliefActivities } from "./reliefActivityRepository.js";

export const reliefActivityRouter = Router();

reliefActivityRouter.get("/", async (_request, response, next) => {
  try {
    response.json(await getReliefActivities());
  } catch (error) {
    next(error);
  }
});
