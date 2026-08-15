import type {
  ApiItemResponse,
  ApiListResponse,
  CreateReliefServiceInput,
  ReliefServiceRecord,
  UpdateReliefServiceInput,
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

export async function listReliefServices(): Promise<
  ReliefServiceRecord[]
> {
  const response =
    await requestJson<ApiListResponse<ReliefServiceRecord>>(
      "/api/relief-services"
    );

  return response.data;
}

export async function createReliefService(
  input: CreateReliefServiceInput
): Promise<ReliefServiceRecord> {
  const response =
    await requestJson<ApiItemResponse<ReliefServiceRecord>>(
      "/api/relief-services",
      {
        method: "POST",
        body: JSON.stringify(input),
      }
    );

  return response.data;
}

export async function updateReliefService(
  id: string,
  input: UpdateReliefServiceInput
): Promise<ReliefServiceRecord> {
  const response =
    await requestJson<ApiItemResponse<ReliefServiceRecord>>(
      `/api/relief-services/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      }
    );

  return response.data;
}

export async function deleteReliefService(
  id: string
): Promise<void> {
  await requestJson<void>(
    `/api/relief-services/${id}`,
    {
      method: "DELETE",
    }
  );
}