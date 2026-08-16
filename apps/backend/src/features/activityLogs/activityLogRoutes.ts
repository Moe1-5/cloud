import { Router } from "express";

import {
  listActivityLogs,
} from "./activityLogRepository.js";

export const activityLogRouter =
  Router();

activityLogRouter.get(
  "/",
  async (
    _request,
    response,
    next
  ) => {
    try {
      const logs =
        await listActivityLogs();

      response.json({
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }
);