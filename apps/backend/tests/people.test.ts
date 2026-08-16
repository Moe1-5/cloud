import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { resetVictimsForTests } from "../src/features/victims/victimRepository.js";
import { resetVolunteersForTests } from "../src/features/volunteers/volunteerRepository.js";

describe("victim and volunteer APIs", () => {
  beforeEach(() => {
    resetVictimsForTests();
    resetVolunteersForTests();
  });

  it("supports local victim and volunteer records without AWS credentials", async () => {
    const app = createApp();

    const victimResponse = await request(app).post("/api/victims").send({
      fullName: "Farah Hassan",
      identificationNumber: "MY-900101-14-1234",
      phoneNumber: "+60 12-555 0101",
      location: "Taman Melawati",
      assistanceNeeds: "Drinking water and medication"
    });
    const volunteerResponse = await request(app).post("/api/volunteers").send({
      fullName: "Hana Lim",
      phoneNumber: "+60 12-555 0202",
      skills: "First aid and logistics"
    });

    expect(victimResponse.status).toBe(201);
    expect(volunteerResponse.status).toBe(201);
    expect((await request(app).get("/api/victims")).body.data).toHaveLength(1);
    expect((await request(app).get("/api/volunteers")).body.data).toHaveLength(1);
  });
});
