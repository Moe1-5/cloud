import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { pinoHttp } from "pino-http";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { projectRouter, normalizeApiError } from "./features/projects/projectRoutes.js";
import { resourceRouter } from "./features/resources/resourceRoutes.js";
import { distributionRouter } from "./features/distributions/distributionRoutes.js";
import { reliefActivityRouter } from "./features/activities/reliefActivityRoutes.js";
import { affectedUserProfileRouter } from "./features/profiles/affectedUserProfileRoutes.js";
import { emergencyRequestRouter } from "./features/emergency-requests/emergencyRequestRoutes.js";
import { student3ReportRouter } from "./features/reports/student3ReportRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.get("/health", (_request, response) => {
    response.json({
      data: {
        status: "ok",
        environment: env.APP_ENV,
        database: {
          provider: "dynamodb",
          tableName: env.DYNAMODB_TABLE_NAME,
          region: env.AWS_REGION
        }
      }
    });
  });

  app.use("/api/projects", projectRouter);
  app.use("/api/resources", resourceRouter);
  app.use("/api/distributions", distributionRouter);
  app.use("/api/relief-activities", reliefActivityRouter);
  app.use("/api/affected-user-profiles", affectedUserProfileRouter);
  app.use("/api/emergency-requests", emergencyRequestRouter);
  app.use("/api/reports/student3-operational", student3ReportRouter);

  if (env.SERVE_STATIC_FRONTEND) {
    const frontendDistPath = path.isAbsolute(env.FRONTEND_DIST_PATH)
      ? env.FRONTEND_DIST_PATH
      : path.resolve(__dirname, "../../../", env.FRONTEND_DIST_PATH);

    app.use(express.static(frontendDistPath));
    app.get("*", (_request, response) => {
      response.sendFile(path.join(frontendDistPath, "index.html"));
    });
  }

  app.use(
    (
      error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction
    ) => {
      const normalizedError = normalizeApiError(error);
      const logMethod =
        normalizedError.statusCode >= 500 ? logger.error.bind(logger) : logger.warn.bind(logger);
      logMethod({ error }, normalizedError.message);

      response.status(normalizedError.statusCode).json({
        error: {
          message: normalizedError.message,
          details: normalizedError.details
        }
      });
    }
  );

  return app;
}
