import type {
  ApiItemResponse,
  ApiListResponse,
  CreateProjectInput,
  ProjectRecord,
  UpdateProjectInput
} from "@ddac/shared";
import { requestJson } from "./requestJson.js";

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

export async function updateProject(id: string, input: UpdateProjectInput): Promise<ProjectRecord> {
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
