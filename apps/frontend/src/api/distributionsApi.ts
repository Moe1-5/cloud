import type {
  ApiItemResponse,
  ApiListResponse,
  CreateDistributionInput,
  DistributionRecord,
  DistributionStatus,
  ReliefActivityResponse
} from "@ddac/shared";
import { requestJson } from "./requestJson.js";

export async function listDistributions(): Promise<DistributionRecord[]> {
  const response = await requestJson<ApiListResponse<DistributionRecord>>("/api/distributions");
  return response.data;
}

export async function createDistribution(
  input: CreateDistributionInput
): Promise<DistributionRecord> {
  const response = await requestJson<ApiItemResponse<DistributionRecord>>("/api/distributions", {
    method: "POST",
    body: JSON.stringify(input)
  });

  return response.data;
}

export async function updateDistributionStatus(
  id: string,
  status: DistributionStatus
): Promise<DistributionRecord> {
  const response = await requestJson<ApiItemResponse<DistributionRecord>>(
    `/api/distributions/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status })
    }
  );

  return response.data;
}

export async function getReliefActivities(): Promise<ReliefActivityResponse> {
  return requestJson<ReliefActivityResponse>("/api/relief-activities");
}
