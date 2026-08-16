import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { clearActivityLogs } from "../src/features/activityLogs/activityLogRepository.js";
import { resetAffectedUserProfilesForTests } from "../src/features/profiles/affectedUserProfileRepository.js";
import { deleteUser, listUsers } from "../src/features/users/userRepository.js";

async function clearUsers(): Promise<void> {
  const users = await listUsers();
  await Promise.all(users.map((user) => deleteUser(user.id)));
}

describe("authentication API", () => {
  beforeEach(async () => {
    await clearUsers();
    resetAffectedUserProfilesForTests();
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

  it("registers an affected user and returns a usable session", async () => {
    const app = createApp();

    const registerResponse = await request(app).post("/api/auth/register/affected-user").send({
      fullName: "Aisha Rahman",
      email: "aisha.rahman@example.com",
      password: "Password123!",
      phone: "+60 12-555 0142",
      address: "Taman Melawati, Kuala Lumpur",
      householdSize: 4,
      emergencyContact: "Imran Rahman - +60 12-555 0188"
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.data.token).toEqual(expect.any(String));
    expect(registerResponse.body.data.user).toMatchObject({
      email: "aisha.rahman@example.com",
      role: "affectedUser",
      status: "active"
    });
    expect(registerResponse.body.data.user.passwordHash).toBeUndefined();

    const sessionResponse = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${registerResponse.body.data.token}`);

    expect(sessionResponse.status).toBe(200);
    expect(sessionResponse.body.data.email).toBe("aisha.rahman@example.com");
    expect(sessionResponse.body.data.role).toBe("affectedUser");
  });
});
