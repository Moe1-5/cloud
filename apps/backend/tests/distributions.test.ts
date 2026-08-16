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

  async function createWaterResource(app: ReturnType<typeof createApp>) {
    const response = await request(app).post("/api/resources").send({
      name: "Bottled drinking water",
      category: "water",
      quantity: 840,
      unit: "cartons",
      location: "Central Relief Warehouse",
      reorderLevel: 250
    });

    return response.body.data as { id: string };
  }

  async function createMedicalResource(app: ReturnType<typeof createApp>) {
    const response = await request(app).post("/api/resources").send({
      name: "Emergency medical kits",
      category: "medical",
      quantity: 36,
      unit: "kits",
      location: "Kuala Lumpur Operations Hub",
      reorderLevel: 50
    });

    return response.body.data as { id: string };
  }

  it("records a planned distribution and reserves inventory", async () => {
    const app = createApp();
    const resource = await createWaterResource(app);
    const input = {
      resourceId: resource.id,
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

    const resourceResponse = await request(app).get(`/api/resources/${input.resourceId}`);
    expect(resourceResponse.body.data.quantity).toBe(700);
  });

  it("advances a distribution and rejects an invalid transition", async () => {
    const app = createApp();
    const resource = await createWaterResource(app);
    const created = await request(app).post("/api/distributions").send({
      resourceId: resource.id,
      quantity: 120,
      destination: "Setia Alam Evacuation Centre",
      recipient: "Centre logistics team",
      scheduledAt: "2026-08-13T04:30:00.000Z"
    });
    const distributionId = created.body.data.id as string;

    await request(app)
      .patch(`/api/distributions/${distributionId}/status`)
      .send({ status: "in_transit" });

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
    const resource = await createMedicalResource(app);
    const input = {
      resourceId: resource.id,
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

    const resourceResponse = await request(app).get(`/api/resources/${input.resourceId}`);
    expect(resourceResponse.body.data.quantity).toBe(36);
  });

  it("prevents over-allocation and reports operational activity", async () => {
    const app = createApp();
    const water = await createWaterResource(app);
    const medical = await createMedicalResource(app);
    const activeDistribution = await request(app).post("/api/distributions").send({
      resourceId: water.id,
      quantity: 120,
      destination: "Setia Alam Evacuation Centre",
      recipient: "Centre logistics team",
      scheduledAt: "2026-08-13T04:30:00.000Z"
    });
    await request(app)
      .patch(`/api/distributions/${activeDistribution.body.data.id}/status`)
      .send({ status: "in_transit" });
    const deliveredDistribution = await request(app).post("/api/distributions").send({
      resourceId: medical.id,
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

    const unavailable = await request(app).post("/api/distributions").send({
      resourceId: medical.id,
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
