import { beforeEach, describe, expect, it } from "vitest";

import { createAuthToken } from "../src/features/auth/token.js";
import { handler } from "../src/features/people-serverless/handler.js";
import { resetVictimsForTests } from "../src/features/victims/victimRepository.js";
import { resetVolunteersForTests } from "../src/features/volunteers/volunteerRepository.js";

function event(method: string, rawPath: string, options?: { body?: unknown; token?: string; query?: Record<string, string> }) {
  return {
    rawPath,
    requestContext: { requestId: "gateway-request-1", http: { method } },
    headers: options?.token ? { authorization: `Bearer ${options.token}` } : {},
    queryStringParameters: options?.query,
    body: options?.body ? JSON.stringify(options.body) : null
  };
}

const coordinatorToken = createAuthToken({
  sub: "user#coordinator",
  email: "coordinator@example.com",
  name: "Coordinator",
  role: "reliefCoordinator"
});

describe("Victim and Volunteer Lambda handler", () => {
  beforeEach(() => {
    resetVictimsForTests();
    resetVolunteersForTests();
  });

  it("creates and lists victims through the API Gateway contract", async () => {
    const createResponse = await handler(
      event("POST", "/api/victims", {
        token: coordinatorToken,
        body: {
          fullName: "Aisha Ahmad",
          identificationNumber: "MY-900101-14-1234",
          phoneNumber: "+60 12-555 0101",
          location: "Taman Melawati",
          assistanceNeeds: "Drinking water and medication"
        }
      }),
      { awsRequestId: "lambda-request-1" }
    );
    const listResponse = await handler(
      event("GET", "/api/victims", { token: coordinatorToken, query: { search: "Aisha" } }),
      { awsRequestId: "lambda-request-2" }
    );

    expect(createResponse.statusCode).toBe(201);
    expect(JSON.parse(listResponse.body).data).toHaveLength(1);
  });

  it("supports frontend-encoded victim IDs on an API Gateway path", async () => {
    const createResponse = await handler(
      event("POST", "/api/victims", {
        token: coordinatorToken,
        body: {
          fullName: "Nadia Idris",
          identificationNumber: "MY-910202-10-4321",
          phoneNumber: "+60 12-555 0102",
          location: "Kuala Lumpur",
          assistanceNeeds: "Temporary accommodation"
        }
      }),
      { awsRequestId: "lambda-request-encoded-create" }
    );
    const victimId = JSON.parse(createResponse.body).data.id as string;
    const updateResponse = await handler(
      event("PATCH", `/api/victims/${encodeURIComponent(victimId)}`, {
        token: coordinatorToken,
        body: { location: "Sentul" }
      }),
      { awsRequestId: "lambda-request-encoded-update" }
    );

    expect(updateResponse.statusCode).toBe(200);
    expect(JSON.parse(updateResponse.body).data.location).toBe("Sentul");
  });

  it("rejects missing authentication, non-coordinator roles, and invalid input", async () => {
    const unauthenticated = await handler(event("GET", "/api/volunteers"), { awsRequestId: "lambda-request-3" });
    const affectedUserToken = createAuthToken({ sub: "user#affected", email: "affected@example.com", name: "Affected User", role: "affectedUser" });
    const forbidden = await handler(event("GET", "/api/volunteers", { token: affectedUserToken }), { awsRequestId: "lambda-request-4" });
    const invalid = await handler(event("POST", "/api/volunteers", { token: coordinatorToken, body: { fullName: "A" } }), { awsRequestId: "lambda-request-5" });

    expect(unauthenticated.statusCode).toBe(401);
    expect(forbidden.statusCode).toBe(403);
    expect(invalid.statusCode).toBe(400);
  });
});
