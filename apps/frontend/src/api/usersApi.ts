import type {
  ApiItemResponse,
  ApiListResponse,
  CreateUserAccountWithPasswordInput,
  UpdateUserAccountInput,
  UserAccountRecord,
} from "@ddac/shared";
import { getAuthHeaders } from "./authSession.js";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "";

async function requestJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${apiBaseUrl}${path}`,
    {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...init?.headers,
      },
    }
  );

  if (!response.ok) {
    const fallbackMessage =
      `Request failed with status ${response.status}`;

    const errorBody = await response
      .json()
      .catch(() => undefined);

    const message =
      typeof errorBody?.error?.message ===
      "string"
        ? errorBody.error.message
        : fallbackMessage;

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// Get all users
export async function listUsers(): Promise<
  UserAccountRecord[]
> {
  const response =
    await requestJson<
      ApiListResponse<UserAccountRecord>
    >("/api/users");

  return response.data;
}

// Create user
export async function createUser(
  input: CreateUserAccountWithPasswordInput
): Promise<UserAccountRecord> {
  const response =
    await requestJson<
      ApiItemResponse<UserAccountRecord>
    >("/api/users", {
      method: "POST",
      body: JSON.stringify(input),
    });

  return response.data;
}

// Update user
export async function updateUser(
  id: string,
  input: UpdateUserAccountInput & { password?: string }
): Promise<UserAccountRecord> {
  const response =
    await requestJson<
      ApiItemResponse<UserAccountRecord>
    >(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });

  return response.data;
}

// Delete user
export async function deleteUser(
  id: string
): Promise<void> {
  await requestJson<void>(
    `/api/users/${id}`,
    {
      method: "DELETE",
    }
  );
}
