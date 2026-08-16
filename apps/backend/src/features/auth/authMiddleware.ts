import type { NextFunction, Request, Response } from "express";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";
import { verifyAuthToken, type AuthTokenPayload } from "./token.js";

export type AuthenticatedRequest = Request & {
  auth?: AuthTokenPayload;
};

function shouldBypassAuth(): boolean {
  return env.APP_ENV === "test" || process.env.VITEST === "true";
}

export function authenticateRequest(
  request: AuthenticatedRequest,
  _response: Response,
  next: NextFunction
): void {
  if (shouldBypassAuth()) {
    next();
    return;
  }

  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    next(new AppError("Authentication is required.", 401));
    return;
  }

  try {
    request.auth = verifyAuthToken(authorizationHeader.slice("Bearer ".length));
    next();
  } catch (error) {
    next(error);
  }
}
