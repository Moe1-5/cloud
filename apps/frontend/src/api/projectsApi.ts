import type {
  ApiItemResponse,
  ApiListResponse,
  CreateProjectInput,
  ProjectRecord,
  UpdateProjectInput
} from "@ddac/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`;
    const errorBody = await response.json().catch(() => undefined);
    const message =
      typeof errorBody?.error?.message === "string" ? errorBody.error.message : fallbackMessage;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function listProjects(): Promise<ProjectRecord[]> {
  const response = await requestJson<ApiListResponse<ProjectRecord>>("/api/projects");
  return response.data;
}

export async function createProject(input: CreateProjectInput): Promise<ProjectRecord> {
  const response = await requestJson<ApiItemResponse<ProjectRecord>>("/api/projects", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return response.data;
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput
): Promise<ProjectRecord> {
  const response = await requestJson<ApiItemResponse<ProjectRecord>>(`/api/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return response.data;
}

export async function deleteProject(id: string): Promise<void> {
  await requestJson<void>(`/api/projects/${id}`, {
    method: "DELETE"
  });
}
