import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { pinoHttp } from "pino-http";
import { fileURLToPath } from "node:url";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

import { activityLogRouter } from "./features/activityLogs/activityLogRoutes.js";
import { authenticateRequest } from "./features/auth/authMiddleware.js";
import { authRouter } from "./features/auth/authRoutes.js";
import { reliefActivityRouter } from "./features/activities/reliefActivityRoutes.js";
import { disasterRouter } from "./features/disasters/disasterRoutes.js";
import { distributionRouter } from "./features/distributions/distributionRoutes.js";
import { emergencyRequestRouter } from "./features/emergency-requests/emergencyRequestRoutes.js";
import { organisationRouter } from "./features/organisations/organisationRoutes.js";
import { affectedUserProfileRouter } from "./features/profiles/affectedUserProfileRoutes.js";

import {
  projectRouter,
  normalizeApiError,
} from "./features/projects/projectRoutes.js";

import { reliefServiceRouter } from "./features/reliefServices/reliefServiceRoutes.js";
import { student3ReportRouter } from "./features/reports/student3ReportRoutes.js";
import { resourceRouter } from "./features/resources/resourceRoutes.js";
import { shelterRouter } from "./features/shelters/shelterRoutes.js";
import { userRouter } from "./features/users/userRoutes.js";
import { victimRouter } from "./features/victims/victimRoutes.js";
import { volunteerRouter } from "./features/volunteers/volunteerRoutes.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();


  // Security Middleware

  //
  // Elastic Beanstalk is currently running as a
  // single-instance HTTP environment.
  //
  // Helmet normally adds:
  //
  // upgrade-insecure-requests
  //
  // which forces browsers to request JS/CSS over HTTPS.
  // Since HTTPS is not configured yet, we disable only
  // that directive while keeping Helmet's other protections.
  //
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          upgradeInsecureRequests: null,
        },
      },
    })
  );


  // CORS


  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );


  // Request Body Parsing


  app.use(express.json());


  // Request Logging


  app.use(
    pinoHttp({
      logger,
    })
  );


  // Health Check


  app.get("/health", (_request, response) => {
    response.json({
      data: {
        status: "ok",

        environment: env.APP_ENV,

        database: {
          provider: "dynamodb",

          tableName: env.DYNAMODB_TABLE_NAME,

          region: env.AWS_REGION,
        },
      },
    });
  });


  // Authentication Routes


  app.use("/api/auth", authRouter);

  // Everything after /api/auth requires authentication
  app.use("/api", authenticateRequest);


  // Project Routes


  app.use("/api/projects", projectRouter);


  // Disaster Information


  app.use("/api/disasters", disasterRouter);


  // Shelter / Evacuation Centre


  app.use("/api/shelters", shelterRouter);


  // Food Distribution + Medical Services


  app.use(
    "/api/relief-services",
    reliefServiceRouter
  );


  // User Account Management


  app.use("/api/users", userRouter);


  // Relief Organisation Management


  app.use(
    "/api/organisations",
    organisationRouter
  );


  // Activity Logs


  app.use(
    "/api/activity-logs",
    activityLogRouter
  );


  // Victim and Volunteer Coordination


  app.use("/api/victims", victimRouter);

  app.use(
    "/api/volunteers",
    volunteerRouter
  );


  // Resource Operations


  app.use(
    "/api/resources",
    resourceRouter
  );


  // Distribution Management


  app.use(
    "/api/distributions",
    distributionRouter
  );


  // Relief Activities


  app.use(
    "/api/relief-activities",
    reliefActivityRouter
  );


  // Affected User Profiles


  app.use(
    "/api/affected-user-profiles",
    affectedUserProfileRouter
  );


  // Emergency Requests


  app.use(
    "/api/emergency-requests",
    emergencyRequestRouter
  );


  // Reports


  app.use(
    "/api/reports/student3-operational",
    student3ReportRouter
  );


  // Static React Frontend


  if (env.SERVE_STATIC_FRONTEND) {
    const frontendDistPath =
      path.isAbsolute(env.FRONTEND_DIST_PATH)
        ? env.FRONTEND_DIST_PATH
        : path.resolve(
            __dirname,
            "../../../",
            env.FRONTEND_DIST_PATH
          );

    app.use(
      express.static(frontendDistPath)
    );

    // React SPA fallback
    app.get(
      "*",
      (_request, response) => {
        response.sendFile(
          path.join(
            frontendDistPath,
            "index.html"
          )
        );
      }
    );
  }


  // Error Handling


  app.use(
    (
      error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction
    ) => {
      const normalizedError =
        normalizeApiError(error);

      const logMethod =
        normalizedError.statusCode >= 500
          ? logger.error.bind(logger)
          : logger.warn.bind(logger);

      logMethod(
        {
          error,
        },
        normalizedError.message
      );

      response
        .status(normalizedError.statusCode)
        .json({
          error: {
            message:
              normalizedError.message,

            details:
              normalizedError.details,
          },
        });
    }
  );

  return app;
}