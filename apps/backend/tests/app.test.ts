import request from "supertest";
import { describe, expect, it } from "vitest";

const task2ApiBaseUrl = "https://task2-api.example.com";
process.env.TASK2_API_BASE_URL = task2ApiBaseUrl;

const { createApp } = await import("../src/app.js");

describe("app", () => {
  it("returns health information", async () => {
    const response = await request(createApp()).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("ok");
    expect(response.body.data.database.provider).toBe("dynamodb");
  });

  it("allows the configured Task 2 API through the content security policy", async () => {
    const response = await request(createApp()).get("/health");

    expect(response.headers["content-security-policy"]).toContain(
      `connect-src 'self' ${task2ApiBaseUrl}`
    );
  });
});
