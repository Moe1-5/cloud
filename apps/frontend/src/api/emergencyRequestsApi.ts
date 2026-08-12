import type {
  AffectedUserProfileRecord,
  ApiItemResponse,
  ApiListResponse,
  CoordinatorEmergencyUpdateInput,
  CreateAffectedUserProfileInput,
  CreateEmergencyRequestInput,
  EmergencyRequestRecord,
  UpdateAffectedUserProfileInput,
  UpdateEmergencyRequestInput
} from "@ddac/shared";
import { requestJson } from "./requestJson.js";

export async function listAffectedUserProfiles(): Promise<AffectedUserProfileRecord[]> {
  const response = await requestJson<ApiListResponse<AffectedUserProfileRecord>>(
    "/api/affected-user-profiles"
  );
  return response.data;
}

export async function createAffectedUserProfile(
  input: CreateAffectedUserProfileInput
): Promise<AffectedUserProfileRecord> {
  const response = await requestJson<ApiItemResponse<AffectedUserProfileRecord>>(
    "/api/affected-user-profiles",
    { method: "POST", body: JSON.stringify(input) }
  );
  return response.data;
}

export async function updateAffectedUserProfile(
  id: string,
  input: UpdateAffectedUserProfileInput
): Promise<AffectedUserProfileRecord> {
  const response = await requestJson<ApiItemResponse<AffectedUserProfileRecord>>(
    `/api/affected-user-profiles/${id}`,
    { method: "PATCH", body: JSON.stringify(input) }
  );
  return response.data;
}

export async function listEmergencyRequests(
  requesterId?: string
): Promise<EmergencyRequestRecord[]> {
  const query = requesterId ? `?requesterId=${encodeURIComponent(requesterId)}` : "";
  const response = await requestJson<ApiListResponse<EmergencyRequestRecord>>(
    `/api/emergency-requests${query}`
  );
  return response.data;
}

export async function createEmergencyRequest(
  input: CreateEmergencyRequestInput
): Promise<EmergencyRequestRecord> {
  const response = await requestJson<ApiItemResponse<EmergencyRequestRecord>>(
    "/api/emergency-requests",
    { method: "POST", body: JSON.stringify(input) }
  );
  return response.data;
}

export async function updateEmergencyRequest(
  id: string,
  input: UpdateEmergencyRequestInput
): Promise<EmergencyRequestRecord> {
  const response = await requestJson<ApiItemResponse<EmergencyRequestRecord>>(
    `/api/emergency-requests/${id}`,
    { method: "PATCH", body: JSON.stringify(input) }
  );
  return response.data;
}

export async function cancelEmergencyRequest(
  id: string,
  requesterId: string
): Promise<EmergencyRequestRecord> {
  const response = await requestJson<ApiItemResponse<EmergencyRequestRecord>>(
    `/api/emergency-requests/${id}/cancel`,
    { method: "PATCH", body: JSON.stringify({ requesterId }) }
  );
  return response.data;
}

export async function updateEmergencyRequestByCoordinator(
  id: string,
  input: CoordinatorEmergencyUpdateInput
): Promise<EmergencyRequestRecord> {
  const response = await requestJson<ApiItemResponse<EmergencyRequestRecord>>(
    `/api/emergency-requests/${id}/coordinator`,
    { method: "PATCH", body: JSON.stringify(input) }
  );
  return response.data;
}
