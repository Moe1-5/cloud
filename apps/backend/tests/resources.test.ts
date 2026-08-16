import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { resetResourcesForTests } from "../src/features/resources/resourceRepository.js";

describe("resource API", () => {
  beforeEach(() => {
    resetResourcesForTests();
  });

  it("creates, lists, and reads a relief resource", async () => {
    const app = createApp();
    const input = {
      name: "Family food packs",
      category: "food",
      quantity: 120,
      unit: "packs",
      location: "Shah Alam Distribution Centre",
      reorderLevel: 40
    };

    const created = await request(app).post("/api/resources").send(input);

    expect(created.status).toBe(201);
    expect(created.body.data).toMatchObject({
      ...input,
      entityType: "resource",
      stockStatus: "available"
    });

    const listed = await request(app).get("/api/resources");
    expect(listed.status).toBe(200);
    expect(listed.body.data).toHaveLength(1);

    const read = await request(app).get(`/api/resources/${created.body.data.id}`);
    expect(read.status).toBe(200);
    expect(read.body.data.name).toBe(input.name);
  });

  it("updates quantity, location, and derived stock state", async () => {
    const app = createApp();
    const created = await request(app).post("/api/resources").send({
      name: "Bottled drinking water",
      category: "water",
      quantity: 840,
      unit: "cartons",
      location: "Central Relief Warehouse",
      reorderLevel: 250
    });
    const resourceId = created.body.data.id as string;

    const updated = await request(app).patch(`/api/resources/${resourceId}`).send({
      quantity: 200,
      location: "Petaling Jaya Response Hub"
    });

    expect(updated.status).toBe(200);
    expect(updated.body.data).toMatchObject({
      quantity: 200,
      location: "Petaling Jaya Response Hub",
      stockStatus: "low_stock"
    });
  });

  it("validates input and deletes an existing resource", async () => {
    const app = createApp();
    const created = await request(app).post("/api/resources").send({
      name: "Emergency medical kits",
      category: "medical",
      quantity: 36,
      unit: "kits",
      location: "Kuala Lumpur Operations Hub",
      reorderLevel: 50
    });
    const resourceId = created.body.data.id as string;

    const invalid = await request(app).post("/api/resources").send({
      name: "A"
    });
    expect(invalid.status).toBe(400);

    const deleted = await request(app).delete(`/api/resources/${resourceId}`);
    expect(deleted.status).toBe(204);

    const missing = await request(app).get(`/api/resources/${resourceId}`);
    expect(missing.status).toBe(404);
  });
});
