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
    const response = await request(createApp()).get("/api/reports/student3-operational");

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
