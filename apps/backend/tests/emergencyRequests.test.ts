import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { resetEmergencyRequestsForTests } from "../src/features/emergency-requests/emergencyRequestRepository.js";
import { resetAffectedUserProfilesForTests } from "../src/features/profiles/affectedUserProfileRepository.js";

describe("affected-user profile and emergency-request APIs", () => {
  beforeEach(() => {
    resetAffectedUserProfilesForTests();
    resetEmergencyRequestsForTests();
  });

  async function createAishaProfile(app: ReturnType<typeof createApp>) {
    const response = await request(app).post("/api/affected-user-profiles").send({
      fullName: "Aisha Rahman",
      email: "aisha.rahman@example.com",
      phone: "+60 12-555 0142",
      address: "Taman Melawati, Kuala Lumpur",
      householdSize: 4,
      emergencyContact: "Imran Rahman - +60 12-555 0188"
    });

    return response.body.data as { id: string };
  }

  it("registers and updates an affected-user profile", async () => {
    const app = createApp();
    const input = {
      fullName: "Daniel Tan",
      email: "daniel.tan@example.com",
      phone: "+60 13-555 0102",
      address: "Bandar Baru Ampang, Selangor",
      householdSize: 3,
      emergencyContact: "Mei Tan - +60 13-555 0108"
    };

    const created = await request(app).post("/api/affected-user-profiles").send(input);
    expect(created.status).toBe(201);
    expect(created.body.data).toMatchObject({
      ...input,
      entityType: "affected_user_profile"
    });

    const updated = await request(app)
      .patch(`/api/affected-user-profiles/${created.body.data.id}`)
      .send({ householdSize: 5 });
    expect(updated.status).toBe(200);
    expect(updated.body.data.householdSize).toBe(5);
  });

  it("rejects a duplicate affected-user email", async () => {
    const app = createApp();
    await createAishaProfile(app);
    const duplicate = await request(app).post("/api/affected-user-profiles").send({
      fullName: "Another User",
      email: "AISHA.RAHMAN@example.com",
      phone: "+60 13-555 0199",
      address: "Setapak, Kuala Lumpur",
      householdSize: 2,
      emergencyContact: "Family Contact - +60 13-555 0198"
    });

    expect(duplicate.status).toBe(409);
  });

  it("lets an affected user submit, update, and cancel an eligible request", async () => {
    const app = createApp();
    const profile = await createAishaProfile(app);
    const requesterId = profile.id;
    const input = {
      requesterId,
      assistanceType: "rescue",
      description: "Flood water is entering the ground floor and safe evacuation is required.",
      location: "Taman Melawati, Kuala Lumpur",
      peopleAffected: 4
    };

    const created = await request(app).post("/api/emergency-requests").send(input);
    expect(created.status).toBe(201);
    expect(created.body.data).toMatchObject({
      requesterName: "Aisha Rahman",
      priority: "medium",
      status: "submitted"
    });

    const updated = await request(app)
      .patch(`/api/emergency-requests/${created.body.data.id}`)
      .send({ requesterId, peopleAffected: 5 });
    expect(updated.status).toBe(200);
    expect(updated.body.data.peopleAffected).toBe(5);

    const cancelled = await request(app)
      .patch(`/api/emergency-requests/${created.body.data.id}/cancel`)
      .send({ requesterId });
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.data.status).toBe("cancelled");
    expect(
      cancelled.body.data.statusHistory.map((event: { status: string }) => event.status)
    ).toEqual(["submitted", "cancelled"]);
  });

  it("enforces request ownership and affected-user edit status", async () => {
    const app = createApp();
    const profile = await createAishaProfile(app);
    const createdRequest = await request(app).post("/api/emergency-requests").send({
      requesterId: profile.id,
      assistanceType: "food_water",
      description: "Household needs drinking water and shelf-stable food after road closure.",
      location: "Taman Melawati, Kuala Lumpur",
      peopleAffected: 4
    });
    const requestId = createdRequest.body.data.id as string;
    await request(app)
      .patch(`/api/emergency-requests/${requestId}/coordinator`)
      .send({ status: "under_review" });
    await request(app)
      .patch(`/api/emergency-requests/${requestId}/coordinator`)
      .send({ status: "assigned", assignedTo: "Nur Izzati - Relief Team 4" });

    const wrongOwner = await request(app).patch(`/api/emergency-requests/${requestId}`).send({
      requesterId: "28443d2e-9b48-428a-aa17-52b7d9d7d72e",
      description: "Attempted change by another profile."
    });
    expect(wrongOwner.status).toBe(403);

    const assignedRequest = await request(app).patch(`/api/emergency-requests/${requestId}`).send({
      requesterId: profile.id,
      description: "The assigned request should no longer be editable."
    });
    expect(assignedRequest.status).toBe(409);
  });

  it("supports coordinator review, priority, assignment, progress, and resolution", async () => {
    const app = createApp();
    const profile = await createAishaProfile(app);
    const createdRequest = await request(app).post("/api/emergency-requests").send({
      requesterId: profile.id,
      assistanceType: "medical",
      description: "Elderly family member requires medication and a medical assessment.",
      location: "Taman Melawati, Kuala Lumpur",
      peopleAffected: 2
    });
    const requestId = createdRequest.body.data.id as string;
    await request(app)
      .patch(`/api/emergency-requests/${requestId}/coordinator`)
      .send({ status: "under_review" });

    const assigned = await request(app)
      .patch(`/api/emergency-requests/${requestId}/coordinator`)
      .send({
        priority: "critical",
        status: "assigned",
        assignedTo: "Dr Siti - Mobile Medical Unit",
        coordinatorNotes: "Dispatch immediately."
      });
    expect(assigned.status).toBe(200);
    expect(assigned.body.data).toMatchObject({
      priority: "critical",
      status: "assigned",
      assignedTo: "Dr Siti - Mobile Medical Unit"
    });

    const inProgress = await request(app)
      .patch(`/api/emergency-requests/${requestId}/coordinator`)
      .send({ status: "in_progress" });
    expect(inProgress.status).toBe(200);

    const resolved = await request(app)
      .patch(`/api/emergency-requests/${requestId}/coordinator`)
      .send({ status: "resolved" });
    expect(resolved.status).toBe(200);
    expect(resolved.body.data.status).toBe("resolved");
    expect(resolved.body.data.statusHistory).toHaveLength(5);
    expect(resolved.body.data.statusHistory.at(-1)).toMatchObject({
      status: "resolved",
      actor: "coordinator"
    });
  });

  it("requires review and an officer before a request can be assigned", async () => {
    const app = createApp();
    const profile = await createAishaProfile(app);
    const requesterId = profile.id;
    const created = await request(app).post("/api/emergency-requests").send({
      requesterId,
      assistanceType: "shelter",
      description: "Temporary shelter is needed because the home is unsafe after flooding.",
      location: "Wangsa Maju, Kuala Lumpur",
      peopleAffected: 3
    });

    const skippedReview = await request(app)
      .patch(`/api/emergency-requests/${created.body.data.id}/coordinator`)
      .send({ status: "assigned", assignedTo: "Relief Team 2" });
    expect(skippedReview.status).toBe(409);

    const reviewed = await request(app)
      .patch(`/api/emergency-requests/${created.body.data.id}/coordinator`)
      .send({ status: "under_review" });
    expect(reviewed.status).toBe(200);

    const missingOfficer = await request(app)
      .patch(`/api/emergency-requests/${created.body.data.id}/coordinator`)
      .send({ status: "assigned" });
    expect(missingOfficer.status).toBe(409);
  });
});
