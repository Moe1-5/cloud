import { Router } from "express";
import { getStudent3OperationalReport } from "./student3ReportRepository.js";

export const student3ReportRouter = Router();

student3ReportRouter.get("/", async (_request, response, next) => {
  try {
    response.json({ data: await getStudent3OperationalReport() });
  } catch (error) {
    next(error);
  }
});
