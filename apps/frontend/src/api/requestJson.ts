const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

interface ErrorBody {
  error?: {
    message?: unknown;
  };
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`;
    const errorBody = (await response.json().catch(() => undefined)) as ErrorBody | undefined;
    const message =
      typeof errorBody?.error?.message === "string" ? errorBody.error.message : fallbackMessage;

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
