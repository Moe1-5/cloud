import type {
  ActivityLogRecord,
  ApiListResponse,
} from "@ddac/shared";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "";

async function requestJson<T>(
  path: string
): Promise<T> {
  const response = await fetch(
    `${apiBaseUrl}${path}`,
    {
      headers: {
        "Content-Type":
          "application/json",
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

  return response.json() as Promise<T>;
}

export async function listActivityLogs(): Promise<
  ActivityLogRecord[]
> {
  const response =
    await requestJson<
      ApiListResponse<ActivityLogRecord>
    >("/api/activity-logs");

  return response.data;
}