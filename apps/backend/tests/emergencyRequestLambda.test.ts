import { beforeEach, describe, expect, it } from "vitest";
import { createAuthToken } from "../src/features/auth/token.js";
import {
  createAffectedUserProfile,
  resetAffectedUserProfilesForTests
} from "../src/features/profiles/affectedUserProfileRepository.js";
import { resetEmergencyRequestsForTests } from "../src/features/emergency-requests/emergencyRequestRepository.js";
import { handler, type ApiGatewayHttpEvent } from "../src/serverless/emergencyRequestLambda.js";

describe("emergency-request API Gateway Lambda", () => {
  beforeEach(() => {
    resetAffectedUserProfilesForTests();
    resetEmergencyRequestsForTests();
  });

  function token(email: string, role: "affectedUser" | "reliefCoordinator") {
    return createAuthToken({
      sub: "2f9d4cb5-7e43-4b96-95da-85c89f4c99dd",
      email,
      role,
      name: role === "affectedUser" ? "Aisha Rahman" : "Coordinator Noor"
    });
  }

  function event(
    method: string,
    path: string,
    authToken: string,
    body?: unknown
  ): ApiGatewayHttpEvent {
    return {
      rawPath: path,
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: { authorization: `Bearer ${authToken}` },
      requestContext: { requestId: "lambda-test-request", http: { method } }
    };
  }

  it("validates ownership and creates an emergency request through the Lambda boundary", async () => {
    const profile = await createAffectedUserProfile({
      fullName: "Aisha Rahman",
      email: "aisha.rahman@example.com",
      phone: "+60 12-555 0142",
      address: "Taman Melawati, Kuala Lumpur",
      householdSize: 4,
      emergencyContact: "Imran Rahman - +60 12-555 0188"
    });
    const response = await handler(
      event("POST", "/emergency-requests", token(profile.email, "affectedUser"), {
        requesterId: profile.id,
        assistanceType: "rescue",
        description: "Flood water is entering the ground floor and evacuation is required.",
        location: "Taman Melawati, Kuala Lumpur",
        peopleAffected: 4
      })
    );

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toMatchObject({
      data: { requesterName: "Aisha Rahman", status: "submitted" }
    });
    expect(response.headers["x-request-id"]).toBe("lambda-test-request");
  });

  it("rejects coordinator operations from an affected-user token", async () => {
    const profile = await createAffectedUserProfile({
      fullName: "Aisha Rahman",
      email: "aisha.rahman@example.com",
      phone: "+60 12-555 0142",
      address: "Taman Melawati, Kuala Lumpur",
      householdSize: 4,
      emergencyContact: "Imran Rahman - +60 12-555 0188"
    });
    const created = await handler(
      event("POST", "/emergency-requests", token(profile.email, "affectedUser"), {
        requesterId: profile.id,
        assistanceType: "shelter",
        description: "Temporary shelter is needed because the home is unsafe after flooding.",
        location: "Wangsa Maju, Kuala Lumpur",
        peopleAffected: 3
      })
    );
    const requestId = JSON.parse(created.body).data.id as string;

    const response = await handler(
      event(
        "PATCH",
        `/emergency-requests/${requestId}/coordinator`,
        token(profile.email, "affectedUser"),
        { status: "under_review" }
      )
    );

    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body).error.message).toContain("Only relief coordinators");
  });

  it("allows a coordinator to move a request through a valid transition", async () => {
    const profile = await createAffectedUserProfile({
      fullName: "Aisha Rahman",
      email: "aisha.rahman@example.com",
      phone: "+60 12-555 0142",
      address: "Taman Melawati, Kuala Lumpur",
      householdSize: 4,
      emergencyContact: "Imran Rahman - +60 12-555 0188"
    });
    const created = await handler(
      event("POST", "/emergency-requests", token(profile.email, "affectedUser"), {
        requesterId: profile.id,
        assistanceType: "medical",
        description: "An elderly family member needs medicine and medical assessment.",
        location: "Taman Melawati, Kuala Lumpur",
        peopleAffected: 2
      })
    );
    const requestId = JSON.parse(created.body).data.id as string;

    const response = await handler(
      event(
        "PATCH",
        `/emergency-requests/${requestId}/coordinator`,
        token("coordinator@example.com", "reliefCoordinator"),
        { status: "under_review" }
      )
    );

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({ data: { status: "under_review" } });
  });
});
