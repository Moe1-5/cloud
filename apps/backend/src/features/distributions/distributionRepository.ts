import type { CreateDistributionInput, DistributionRecord, DistributionStatus } from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { adjustResourceQuantity, getResourceById } from "../resources/resourceRepository.js";
import { AppError, NotFoundError } from "../../shared/errors.js";
import {
  clearRecordsForTests,
  getRecordById,
  listRecordsByEntity,
  putRecord
} from "../../shared/dynamoRepository.js";

const ALLOWED_TRANSITIONS: Record<DistributionStatus, DistributionStatus[]> = {
  planned: ["in_transit", "cancelled"],
  in_transit: ["delivered", "cancelled"],
  delivered: [],
  cancelled: []
};

export async function listDistributions(): Promise<DistributionRecord[]> {
  return listRecordsByEntity<DistributionRecord>("distribution", "updatedAt");
}

export async function getDistributionById(id: string): Promise<DistributionRecord> {
  return getRecordById<DistributionRecord>(id, "distribution", "Distribution");
}

export async function createDistribution(
  input: CreateDistributionInput
): Promise<DistributionRecord> {
  const resource = await getResourceById(input.resourceId);
  await adjustResourceQuantity(resource.id, -input.quantity);

  const timestamp = new Date().toISOString();
  const distribution: DistributionRecord = {
    id: randomUUID(),
    entityType: "distribution",
    resourceId: resource.id,
    resourceName: resource.name,
    quantity: input.quantity,
    unit: resource.unit,
    origin: resource.location,
    destination: input.destination,
    recipient: input.recipient,
    status: "planned",
    scheduledAt: input.scheduledAt,
    notes: input.notes,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  return putRecord(distribution);
}

export async function updateDistributionStatus(
  id: string,
  status: DistributionStatus
): Promise<DistributionRecord> {
  const currentDistribution = await getDistributionById(id);

  if (!ALLOWED_TRANSITIONS[currentDistribution.status].includes(status)) {
    throw new AppError(
      `Distribution cannot move from ${currentDistribution.status} to ${status}.`,
      409
    );
  }

  if (status === "cancelled") {
    await adjustResourceQuantity(currentDistribution.resourceId, currentDistribution.quantity);
  }

  const updatedDistribution: DistributionRecord = {
    ...currentDistribution,
    status,
    updatedAt: new Date().toISOString()
  };

  return putRecord(updatedDistribution);
}

export function resetDistributionsForTests(): void {
  clearRecordsForTests("distribution");
}
