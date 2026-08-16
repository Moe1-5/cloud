import type { AddAssistanceInput, ApiItemResponse, ApiListResponse, CreateVictimInput, CreateVolunteerInput, UpdateVictimInput, UpdateVolunteerInput, VictimRecord, VolunteerRecord } from "@ddac/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  if (!response.ok) { const body = await response.json().catch(() => undefined); throw new Error(typeof body?.error?.message === "string" ? body.error.message : `Request failed with status ${response.status}`); }
  return response.json() as Promise<T>;
}
export async function listVictims(search = "") { const response = await requestJson<ApiListResponse<VictimRecord>>(`/api/victims?search=${encodeURIComponent(search)}`); return response.data; }
export async function createVictim(input: CreateVictimInput) { const response = await requestJson<ApiItemResponse<VictimRecord>>("/api/victims", { method: "POST", body: JSON.stringify(input) }); return response.data; }
export async function updateVictim(id: string, input: UpdateVictimInput) { const response = await requestJson<ApiItemResponse<VictimRecord>>(`/api/victims/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(input) }); return response.data; }
export async function addAssistance(id: string, input: AddAssistanceInput) { const response = await requestJson<ApiItemResponse<VictimRecord>>(`/api/victims/${encodeURIComponent(id)}/assistance`, { method: "POST", body: JSON.stringify(input) }); return response.data; }
export async function listVolunteers() { const response = await requestJson<ApiListResponse<VolunteerRecord>>("/api/volunteers"); return response.data; }
export async function createVolunteer(input: CreateVolunteerInput) { const response = await requestJson<ApiItemResponse<VolunteerRecord>>("/api/volunteers", { method: "POST", body: JSON.stringify(input) }); return response.data; }
export async function updateVolunteer(id: string, input: UpdateVolunteerInput) { const response = await requestJson<ApiItemResponse<VolunteerRecord>>(`/api/volunteers/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(input) }); return response.data; }
