import type { ApiItemResponse, AuthSession, LoginInput, UserAccountRecord } from "@ddac/shared";
import { requestJson } from "./requestJson.js";
import { setStoredAuthSession } from "./authSession.js";

export async function login(input: LoginInput): Promise<AuthSession> {
  const response = await requestJson<ApiItemResponse<AuthSession>>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    skipAuth: true
  });

  setStoredAuthSession(response.data);
  return response.data;
}

export async function getCurrentUser(): Promise<UserAccountRecord> {
  const response = await requestJson<ApiItemResponse<UserAccountRecord>>("/api/auth/me");
  return response.data;
}
