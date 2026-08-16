import type {
  ApiItemResponse,
  ApiListResponse,
  CreateShelterInput,
  ShelterRecord,
  UpdateShelterInput,
} from "@ddac/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function requestJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
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

export async function listShelters(): Promise<ShelterRecord[]> {
  const response =
    await requestJson<ApiListResponse<ShelterRecord>>(
      "/api/shelters"
    );

  return response.data;
}

export async function createShelter(
  input: CreateShelterInput
): Promise<ShelterRecord> {
  const response =
    await requestJson<ApiItemResponse<ShelterRecord>>(
      "/api/shelters",
      {
        method: "POST",
        body: JSON.stringify(input),
      }
    );

  return response.data;
}

export async function updateShelter(
  id: string,
  input: UpdateShelterInput
): Promise<ShelterRecord> {
  const response =
    await requestJson<ApiItemResponse<ShelterRecord>>(
      `/api/shelters/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      }
    );

  return response.data;
}

export async function deleteShelter(
  id: string
): Promise<void> {
  await requestJson<void>(
    `/api/shelters/${id}`,
    {
      method: "DELETE",
    }
  );
}