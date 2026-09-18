import { ZodError } from "zod";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";
import { verifyAuthToken, type AuthTokenPayload } from "../auth/token.js";
import { handlePeopleApiRequest } from "./peopleApiService.js";

type ApiGatewayEvent = {
  rawPath: string;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
  requestContext?: { http?: { method?: string }; requestId?: string };
  body?: string | null;
};

type LambdaContext = { awsRequestId: string };
type ApiGatewayResponse = { statusCode: number; headers: Record<string, string>; body: string };

function json(statusCode: number, body: unknown): ApiGatewayResponse {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  };
}

function getAuthorizationHeader(headers: ApiGatewayEvent["headers"]): string | undefined {
  return Object.entries(headers ?? {}).find(([key]) => key.toLowerCase() === "authorization")?.[1];
}

function authenticate(headers: ApiGatewayEvent["headers"]): AuthTokenPayload {
  const authorization = getAuthorizationHeader(headers);
  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError("Authentication is required.", 401);
  }

  return verifyAuthToken(authorization.slice("Bearer ".length));
}

function assertAllowedRole(auth: AuthTokenPayload): void {
  const allowedRoles = env.SERVERLESS_ALLOWED_ROLES.split(",").map((role) => role.trim());
  if (!allowedRoles.includes(auth.role)) {
    throw new AppError("You are not authorized to manage victim and volunteer records.", 403);
  }
}

function parseBody(body: string | null | undefined): unknown {
  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new AppError("Request body must contain valid JSON.", 400);
  }
}

function decodePath(rawPath: string): string {
  try {
    return decodeURIComponent(rawPath);
  } catch {
    throw new AppError("Request path contains invalid encoding.", 400);
  }
}

function toErrorResponse(error: unknown): ApiGatewayResponse {
  if (error instanceof ZodError) {
    return json(400, { error: { message: "Request validation failed.", details: error.flatten() } });
  }

  if (error instanceof AppError) {
    return json(error.statusCode, { error: { message: error.message, details: error.details } });
  }

  return json(500, { error: { message: "Unexpected server error." } });
}

export async function handler(event: ApiGatewayEvent, context: LambdaContext): Promise<ApiGatewayResponse> {
  const requestId = event.requestContext?.requestId ?? context.awsRequestId;
  const path = decodePath(event.rawPath);
  const method = event.requestContext?.http?.method ?? "";

  try {
    const auth = authenticate(event.headers);
    assertAllowedRole(auth);
    const result = await handlePeopleApiRequest({
      method,
      path,
      query: event.queryStringParameters ?? {},
      body: parseBody(event.body),
      auth,
      requestId
    });
    console.info(JSON.stringify({ service: env.SERVERLESS_SERVICE_NAME, requestId, path, method, actorRole: auth.role, statusCode: result.statusCode, outcome: "success" }));
    return json(result.statusCode, result.body);
  } catch (error) {
    const response = toErrorResponse(error);
    console.error(JSON.stringify({ service: env.SERVERLESS_SERVICE_NAME, requestId, path, method, statusCode: response.statusCode, outcome: "failure", error }));
    return response;
  }
}
