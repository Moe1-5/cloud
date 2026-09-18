import type {
  CoordinatorEmergencyUpdateInput,
  CreateEmergencyRequestInput,
  UpdateEmergencyRequestInput
} from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { getAffectedUserProfileById, listAffectedUserProfiles } from "../features/profiles/affectedUserProfileRepository.js";
import {
  cancelEmergencyRequest,
  createEmergencyRequest,
  getEmergencyRequestById,
  listEmergencyRequests,
  updateEmergencyRequest,
  updateEmergencyRequestByCoordinator
} from "../features/emergency-requests/emergencyRequestRepository.js";
import {
  cancelEmergencyRequestSchema,
  coordinatorEmergencyUpdateSchema,
  createEmergencyRequestSchema,
  emergencyRequestIdSchema,
  emergencyRequestQuerySchema,
  updateEmergencyRequestSchema
} from "../features/emergency-requests/emergencyRequestSchemas.js";
import { queueEmergencyRequestNotification } from "../features/emergency-requests/emergencyRequestNotifications.js";
import { AppError } from "../shared/errors.js";
import { verifyAuthToken, type AuthTokenPayload } from "../features/auth/token.js";

export interface ApiGatewayHttpEvent {
  rawPath?: string;
  path?: string;
  body?: string | null;
  isBase64Encoded?: boolean;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined> | null;
  requestContext?: {
    requestId?: string;
    http?: { method?: string };
  };
}

export interface ApiGatewayHttpResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const allowedCoordinatorRoles = new Set(["admin", "reliefCoordinator"]);

function getHeader(event: ApiGatewayHttpEvent, name: string): string | undefined {
  const expectedName = name.toLowerCase();
  const header = Object.entries(event.headers ?? {}).find(
    ([key]) => key.toLowerCase() === expectedName
  );
  return header?.[1];
}

function getRequestId(event: ApiGatewayHttpEvent): string {
  return event.requestContext?.requestId ?? getHeader(event, "x-request-id") ?? randomUUID();
}

function getMethod(event: ApiGatewayHttpEvent): string {
  return (event.requestContext?.http?.method ?? getHeader(event, "x-http-method") ?? "GET").toUpperCase();
}

function getPath(event: ApiGatewayHttpEvent): string {
  const path = event.rawPath ?? event.path ?? "/";
  return path.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}

function getRouteSegments(event: ApiGatewayHttpEvent): string[] {
  const segments = getPath(event).split("/").filter(Boolean);
  return segments[0] === "api" ? segments.slice(1) : segments;
}

function parseBody(event: ApiGatewayHttpEvent): Record<string, unknown> {
  if (!event.body) {
    return {};
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  try {
    const body = JSON.parse(rawBody) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("Body must be a JSON object.");
    }
    return body as Record<string, unknown>;
  } catch {
    throw new AppError("Request body must contain valid JSON.", 400);
  }
}

function requireAuth(event: ApiGatewayHttpEvent): AuthTokenPayload {
  const authorization = getHeader(event, "authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError("Authentication is required.", 401);
  }
  return verifyAuthToken(authorization.slice("Bearer ".length));
}

function requireCoordinator(auth: AuthTokenPayload): void {
  if (!allowedCoordinatorRoles.has(auth.role)) {
    throw new AppError("Only relief coordinators can manage emergency cases.", 403);
  }
}

function normalizeLambdaError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof z.ZodError) {
    return new AppError("Request validation failed.", 400, error.flatten());
  }

  if (typeof error === "object" && error !== null && "name" in error) {
    if (String(error.name) === "ConditionalCheckFailedException") {
      return new AppError("The requested emergency request does not exist.", 404);
    }
  }

  return new AppError("Unexpected server error.", 500);
}

async function assertAffectedUserOwnsProfile(
  requesterId: string,
  auth: AuthTokenPayload
): Promise<void> {
  const profile = await getAffectedUserProfileById(requesterId);
  if (profile.email.toLowerCase() !== auth.email.toLowerCase()) {
    throw new AppError("This emergency request belongs to another affected user.", 403);
  }
}

async function getAuthenticatedAffectedUserProfileId(auth: AuthTokenPayload): Promise<string> {
  const profile = (await listAffectedUserProfiles()).find(
    (candidate) => candidate.email.toLowerCase() === auth.email.toLowerCase()
  );
  if (!profile) {
    throw new AppError("Affected-user profile was not found.", 404);
  }
  return profile.id;
}

async function handleRequest(
  event: ApiGatewayHttpEvent,
  auth: AuthTokenPayload,
  requestId: string
): Promise<{ statusCode: number; data: unknown }> {
  const segments = getRouteSegments(event);
  if (segments[0] !== "emergency-requests" || segments.length > 3) {
    throw new AppError("Emergency request route was not found.", 404);
  }

  const method = getMethod(event);
  const body = parseBody(event);
  const id = segments[1];

  if (!id && method === "GET") {
    const query = emergencyRequestQuerySchema.parse(event.queryStringParameters ?? {});
    const requesterId =
      auth.role === "affectedUser"
        ? await getAuthenticatedAffectedUserProfileId(auth)
        : query.requesterId;
    if (auth.role === "affectedUser" && query.requesterId && query.requesterId !== requesterId) {
      throw new AppError("This emergency request belongs to another affected user.", 403);
    }
    return { statusCode: 200, data: await listEmergencyRequests(requesterId) };
  }

  if (!id && method === "POST") {
    if (auth.role !== "affectedUser") {
      throw new AppError("Only affected users can submit emergency requests.", 403);
    }
    const input = createEmergencyRequestSchema.parse(body) as CreateEmergencyRequestInput;
    await assertAffectedUserOwnsProfile(input.requesterId, auth);
    const request = await createEmergencyRequest(input);
    const notificationStatus = await queueEmergencyRequestNotification(request, requestId);
    logger.info(
      { requestId, emergencyRequestId: request.id, notificationStatus },
      "Emergency request Lambda workflow completed"
    );
    return { statusCode: 201, data: request };
  }

  if (!id) {
    throw new AppError("Emergency request route was not found.", 404);
  }

  const { id: requestIdFromPath } = emergencyRequestIdSchema.parse({ id });
  const currentRequest = await getEmergencyRequestById(requestIdFromPath);

  if (method === "GET") {
    if (auth.role === "affectedUser") {
      await assertAffectedUserOwnsProfile(currentRequest.requesterId, auth);
    } else {
      requireCoordinator(auth);
    }
    return { statusCode: 200, data: currentRequest };
  }

  if (segments[2] === "cancel" && method === "PATCH") {
    if (auth.role !== "affectedUser") {
      throw new AppError("Only affected users can cancel their own requests.", 403);
    }
    const input = cancelEmergencyRequestSchema.parse(body);
    await assertAffectedUserOwnsProfile(input.requesterId, auth);
    if (currentRequest.requesterId !== input.requesterId) {
      throw new AppError("This emergency request belongs to another affected user.", 403);
    }
    return {
      statusCode: 200,
      data: await cancelEmergencyRequest(requestIdFromPath, input.requesterId)
    };
  }

  if (segments[2] === "coordinator" && method === "PATCH") {
    requireCoordinator(auth);
    const input = coordinatorEmergencyUpdateSchema.parse(body) as CoordinatorEmergencyUpdateInput;
    return {
      statusCode: 200,
      data: await updateEmergencyRequestByCoordinator(requestIdFromPath, input)
    };
  }

  if (!segments[2] && method === "PATCH") {
    if (auth.role !== "affectedUser") {
      throw new AppError("Only affected users can edit their own request details.", 403);
    }
    const input = updateEmergencyRequestSchema.parse(body) as UpdateEmergencyRequestInput;
    await assertAffectedUserOwnsProfile(input.requesterId, auth);
    if (currentRequest.requesterId !== input.requesterId) {
      throw new AppError("This emergency request belongs to another affected user.", 403);
    }
    return {
      statusCode: 200,
      data: await updateEmergencyRequest(requestIdFromPath, input)
    };
  }

  throw new AppError("Emergency request route was not found.", 404);
}

function responseHeaders(requestId: string): Record<string, string> {
  return {
    "content-type": "application/json",
    "access-control-allow-origin": env.CORS_ORIGIN,
    "access-control-allow-headers": "authorization,content-type,x-request-id",
    "access-control-allow-methods": "GET,POST,PATCH,OPTIONS",
    "x-request-id": requestId
  };
}

function jsonResponse(
  statusCode: number,
  body: unknown,
  requestId: string
): ApiGatewayHttpResponse {
  return {
    statusCode,
    headers: responseHeaders(requestId),
    body: JSON.stringify(body)
  };
}

export async function handler(event: ApiGatewayHttpEvent): Promise<ApiGatewayHttpResponse> {
  const requestId = getRequestId(event);
  const startedAt = performance.now();
  const method = getMethod(event);
  const route = getPath(event);

  if (method === "OPTIONS") {
    return jsonResponse(204, {}, requestId);
  }

  try {
    const result = await handleRequest(event, requireAuth(event), requestId);
    const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;
    logger.info(
      { requestId, route, method, statusCode: result.statusCode, durationMs },
      "Emergency request Lambda completed"
    );
    return jsonResponse(result.statusCode, { data: result.data }, requestId);
  } catch (error) {
    const normalizedError = normalizeLambdaError(error);
    const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;
    logger.warn(
      {
        requestId,
        route,
        method,
        statusCode: normalizedError.statusCode,
        durationMs,
        error
      },
      "Emergency request Lambda rejected request"
    );
    return jsonResponse(
      normalizedError.statusCode,
      { error: { message: normalizedError.message, details: normalizedError.details } },
      requestId
    );
  }
}
