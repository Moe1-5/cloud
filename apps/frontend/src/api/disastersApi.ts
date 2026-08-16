import type {
  ApiItemResponse,
  ApiListResponse,
  CreateDisasterInput,
  DisasterRecord,
  UpdateDisasterInput,
} from "@ddac/shared";
import { getAuthHeaders } from "./authSession.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function requestJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const fallbackMessage =
      `Request failed with status ${response.status}`;

    const errorBody = await response
      .json()
      .catch(() => undefined);

    const message =
      typeof errorBody?.error?.message === "string"
        ? errorBody.error.message
        : fallbackMessage;

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function listDisasters(): Promise<DisasterRecord[]> {
  const response =
    await requestJson<ApiListResponse<DisasterRecord>>(
      "/api/disasters"
    );

  return response.data;
}

export async function createDisaster(
  input: CreateDisasterInput
): Promise<DisasterRecord> {
  const response =
    await requestJson<ApiItemResponse<DisasterRecord>>(
      "/api/disasters",
      {
        method: "POST",
        body: JSON.stringify(input),
      }
    );

  return response.data;
}

export async function updateDisaster(
  id: string,
  input: UpdateDisasterInput
): Promise<DisasterRecord> {
  const response =
    await requestJson<ApiItemResponse<DisasterRecord>>(
      `/api/disasters/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      }
    );

  return response.data;
}

export async function deleteDisaster(
  id: string
): Promise<void> {
  await requestJson<void>(
    `/api/disasters/${id}`,
    {
      method: "DELETE",
    }
  );
}
