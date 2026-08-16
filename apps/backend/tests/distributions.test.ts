import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { resetDistributionsForTests } from "../src/features/distributions/distributionRepository.js";
import { resetResourcesForTests } from "../src/features/resources/resourceRepository.js";

describe("distribution and relief activity APIs", () => {
  beforeEach(() => {
    resetResourcesForTests();
    resetDistributionsForTests();
  });

  it("records a planned distribution and reserves inventory", async () => {
    const app = createApp();
    const input = {
      resourceId: "28443d2e-9b48-428a-aa17-52b7d9d7d72e",
      quantity: 140,
      destination: "Klang Community Hall",
      recipient: "Hall relief desk",
      scheduledAt: "2026-08-14T03:00:00.000Z",
      notes: "Morning delivery window."
    };

    const created = await request(app).post("/api/distributions").send(input);

    expect(created.status).toBe(201);
    expect(created.body.data).toMatchObject({
      ...input,
      resourceName: "Bottled drinking water",
      origin: "Central Relief Warehouse",
      unit: "cartons",
      status: "planned"
    });

    const resource = await request(app).get(`/api/resources/${input.resourceId}`);
    expect(resource.body.data.quantity).toBe(700);
  });

  it("advances a distribution and rejects an invalid transition", async () => {
    const app = createApp();
    const distributionId = "a581cd5d-08ce-4b59-b23d-f6a5026c5b56";

    const delivered = await request(app)
      .patch(`/api/distributions/${distributionId}/status`)
      .send({ status: "delivered" });
    expect(delivered.status).toBe(200);
    expect(delivered.body.data.status).toBe("delivered");

    const invalid = await request(app)
      .patch(`/api/distributions/${distributionId}/status`)
      .send({ status: "in_transit" });
    expect(invalid.status).toBe(409);
  });

  it("restores reserved inventory when a planned distribution is cancelled", async () => {
    const app = createApp();
    const input = {
      resourceId: "9a4abf2d-ab9f-4929-b798-b610c76b66fd",
      quantity: 10,
      destination: "Ampang Medical Post",
      recipient: "Medical response lead",
      scheduledAt: "2026-08-14T06:00:00.000Z"
    };

    const created = await request(app).post("/api/distributions").send(input);
    expect(created.status).toBe(201);

    const cancelled = await request(app)
      .patch(`/api/distributions/${created.body.data.id}/status`)
      .send({ status: "cancelled" });
    expect(cancelled.status).toBe(200);

    const resource = await request(app).get(`/api/resources/${input.resourceId}`);
    expect(resource.body.data.quantity).toBe(36);
  });

  it("prevents over-allocation and reports operational activity", async () => {
    const app = createApp();

    const unavailable = await request(app).post("/api/distributions").send({
      resourceId: "9a4abf2d-ab9f-4929-b798-b610c76b66fd",
      quantity: 100,
      destination: "Cheras Relief Point",
      recipient: "Relief point coordinator",
      scheduledAt: "2026-08-14T08:00:00.000Z"
    });
    expect(unavailable.status).toBe(409);

    const activities = await request(app).get("/api/relief-activities");
    expect(activities.status).toBe(200);
    expect(activities.body.summary).toEqual({
      activeDistributions: 1,
      deliveredDistributions: 1,
      resourcesNeedingAttention: 1
    });
    expect(activities.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ activityType: "distribution" }),
        expect.objectContaining({ activityType: "inventory_alert", status: "attention" })
      ])
    );
  });
});
