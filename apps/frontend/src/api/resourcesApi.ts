import type {
  ApiItemResponse,
  ApiListResponse,
  CreateResourceInput,
  ResourceRecord,
  UpdateResourceInput
} from "@ddac/shared";
import { requestJson } from "./requestJson.js";

export async function listResources(): Promise<ResourceRecord[]> {
  const response = await requestJson<ApiListResponse<ResourceRecord>>("/api/resources");
  return response.data;
}

export async function createResource(input: CreateResourceInput): Promise<ResourceRecord> {
  const response = await requestJson<ApiItemResponse<ResourceRecord>>("/api/resources", {
    method: "POST",
    body: JSON.stringify(input)
  });

  return response.data;
}

export async function updateResource(
  id: string,
  input: UpdateResourceInput
): Promise<ResourceRecord> {
  const response = await requestJson<ApiItemResponse<ResourceRecord>>(`/api/resources/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });

  return response.data;
}

export async function deleteResource(id: string): Promise<void> {
  await requestJson<void>(`/api/resources/${id}`, {
    method: "DELETE"
  });
}
