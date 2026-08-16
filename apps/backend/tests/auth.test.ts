import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { clearActivityLogs } from "../src/features/activityLogs/activityLogRepository.js";
import { deleteUser, listUsers } from "../src/features/users/userRepository.js";

async function clearUsers(): Promise<void> {
  const users = await listUsers();
  await Promise.all(users.map((user) => deleteUser(user.id)));
}

describe("authentication API", () => {
  beforeEach(async () => {
    await clearUsers();
    clearActivityLogs();
  });

  it("bootstraps the first administrator and returns a usable session", async () => {
    const app = createApp();

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "Admin123!"
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.data.token).toEqual(expect.any(String));
    expect(loginResponse.body.data.user).toMatchObject({
      email: "admin@example.com",
      role: "admin",
      status: "active"
    });
    expect(loginResponse.body.data.user.passwordHash).toBeUndefined();

    const sessionResponse = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(sessionResponse.status).toBe(200);
    expect(sessionResponse.body.data.email).toBe("admin@example.com");
    expect(sessionResponse.body.data.passwordHash).toBeUndefined();
  });

  it("rejects invalid credentials", async () => {
    const response = await request(createApp()).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "wrong-password"
    });

    expect(response.status).toBe(401);
  });
});
