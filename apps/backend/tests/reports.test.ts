import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { resetDistributionsForTests } from "../src/features/distributions/distributionRepository.js";
import { resetEmergencyRequestsForTests } from "../src/features/emergency-requests/emergencyRequestRepository.js";
import { resetAffectedUserProfilesForTests } from "../src/features/profiles/affectedUserProfileRepository.js";
import { resetResourcesForTests } from "../src/features/resources/resourceRepository.js";

describe("Student 3 operational report API", () => {
  beforeEach(() => {
    resetResourcesForTests();
    resetDistributionsForTests();
    resetAffectedUserProfilesForTests();
    resetEmergencyRequestsForTests();
  });

  it("aggregates Student 3 inventory, distribution, profile, and emergency metrics", async () => {
    const app = createApp();
    const water = await request(app).post("/api/resources").send({
      name: "Bottled drinking water",
      category: "water",
      quantity: 840,
      unit: "cartons",
      location: "Central Relief Warehouse",
      reorderLevel: 250
    });
    const medical = await request(app).post("/api/resources").send({
      name: "Emergency medical kits",
      category: "medical",
      quantity: 36,
      unit: "kits",
      location: "Kuala Lumpur Operations Hub",
      reorderLevel: 50
    });
    const activeDistribution = await request(app).post("/api/distributions").send({
      resourceId: water.body.data.id,
      quantity: 120,
      destination: "Setia Alam Evacuation Centre",
      recipient: "Centre logistics team",
      scheduledAt: "2026-08-13T04:30:00.000Z"
    });
    await request(app)
      .patch(`/api/distributions/${activeDistribution.body.data.id}/status`)
      .send({ status: "in_transit" });
    const deliveredDistribution = await request(app).post("/api/distributions").send({
      resourceId: medical.body.data.id,
      quantity: 12,
      destination: "Sentul Community Clinic",
      recipient: "Clinic response unit",
      scheduledAt: "2026-08-12T07:00:00.000Z"
    });
    await request(app)
      .patch(`/api/distributions/${deliveredDistribution.body.data.id}/status`)
      .send({ status: "in_transit" });
    await request(app)
      .patch(`/api/distributions/${deliveredDistribution.body.data.id}/status`)
      .send({ status: "delivered" });
    const profile = await request(app).post("/api/affected-user-profiles").send({
      fullName: "Aisha Rahman",
      email: "aisha.rahman@example.com",
      phone: "+60 12-555 0142",
      address: "Taman Melawati, Kuala Lumpur",
      householdSize: 4,
      emergencyContact: "Imran Rahman - +60 12-555 0188"
    });
    const reviewRequest = await request(app).post("/api/emergency-requests").send({
      requesterId: profile.body.data.id,
      assistanceType: "medical",
      description: "Elderly family member requires medication and a medical assessment.",
      location: "Taman Melawati, Kuala Lumpur",
      peopleAffected: 2
    });
    await request(app)
      .patch(`/api/emergency-requests/${reviewRequest.body.data.id}/coordinator`)
      .send({ status: "under_review" });
    const assignedRequest = await request(app).post("/api/emergency-requests").send({
      requesterId: profile.body.data.id,
      assistanceType: "food_water",
      description: "Household needs drinking water and shelf-stable food after road closure.",
      location: "Taman Melawati, Kuala Lumpur",
      peopleAffected: 4
    });
    await request(app)
      .patch(`/api/emergency-requests/${assignedRequest.body.data.id}/coordinator`)
      .send({ status: "under_review" });
    await request(app)
      .patch(`/api/emergency-requests/${assignedRequest.body.data.id}/coordinator`)
      .send({ status: "assigned", assignedTo: "Nur Izzati - Relief Team 4" });

    const response = await request(app).get("/api/reports/student3-operational");

    expect(response.status).toBe(200);
    expect(response.body.data.inventory).toMatchObject({
      totalResources: 2,
      stockAlerts: 1,
      activeLocations: 2,
      categoryCounts: {
        food: 0,
        water: 1,
        medical: 1,
        shelter: 0,
        hygiene: 0,
        other: 0
      }
    });
    expect(response.body.data.distributions).toEqual({
      total: 2,
      active: 1,
      delivered: 1,
      cancelled: 0,
      completionRate: 50
    });
    expect(response.body.data.affectedUsers).toEqual({
      registeredProfiles: 1,
      representedHouseholdMembers: 4
    });
    expect(response.body.data.emergencyRequests).toEqual({
      total: 2,
      open: 2,
      critical: 0,
      unassigned: 1,
      resolved: 0
    });
    expect(Date.parse(response.body.data.generatedAt)).not.toBeNaN();
  });
});
