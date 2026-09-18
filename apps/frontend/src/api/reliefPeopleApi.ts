import type { AddAssistanceInput, ApiItemResponse, ApiListResponse, CreateVictimInput, CreateVolunteerInput, UpdateVictimInput, UpdateVolunteerInput, VictimRecord, VolunteerRecord } from "@ddac/shared";
import { requestJson } from "./requestJson.js";
import { getTask2ApiBaseUrl } from "./runtimeConfig.js";

function requestPeopleJson<T>(path: string, init?: RequestInit): Promise<T> {
  return requestJson<T>(path, init, getTask2ApiBaseUrl() || undefined);
}
export async function listVictims(search = "") { const response = await requestPeopleJson<ApiListResponse<VictimRecord>>(`/api/victims?search=${encodeURIComponent(search)}`); return response.data; }
export async function createVictim(input: CreateVictimInput) { const response = await requestPeopleJson<ApiItemResponse<VictimRecord>>("/api/victims", { method: "POST", body: JSON.stringify(input) }); return response.data; }
export async function updateVictim(id: string, input: UpdateVictimInput) { const response = await requestPeopleJson<ApiItemResponse<VictimRecord>>(`/api/victims/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(input) }); return response.data; }
export async function addAssistance(id: string, input: AddAssistanceInput) { const response = await requestPeopleJson<ApiItemResponse<VictimRecord>>(`/api/victims/${encodeURIComponent(id)}/assistance`, { method: "POST", body: JSON.stringify(input) }); return response.data; }
export async function listVolunteers() { const response = await requestPeopleJson<ApiListResponse<VolunteerRecord>>("/api/volunteers"); return response.data; }
export async function createVolunteer(input: CreateVolunteerInput) { const response = await requestPeopleJson<ApiItemResponse<VolunteerRecord>>("/api/volunteers", { method: "POST", body: JSON.stringify(input) }); return response.data; }
export async function updateVolunteer(id: string, input: UpdateVolunteerInput) { const response = await requestPeopleJson<ApiItemResponse<VolunteerRecord>>(`/api/volunteers/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(input) }); return response.data; }
