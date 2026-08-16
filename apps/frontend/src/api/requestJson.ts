import { getAuthHeaders } from "./authSession.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

type JsonRequestInit = RequestInit & {
  skipAuth?: boolean;
};

interface ErrorBody {
  error?: {
    message?: unknown;
  };
}

export async function requestJson<T>(path: string, init?: JsonRequestInit): Promise<T> {
  const { skipAuth: _skipAuth, ...requestInit } = init ?? {};
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...(!init?.skipAuth ? getAuthHeaders() : {}),
      ...requestInit.headers
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
