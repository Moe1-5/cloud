import type { CreateDistributionInput, DistributionRecord, DistributionStatus } from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { adjustResourceQuantity, getResourceById } from "../resources/resourceRepository.js";
import { AppError, NotFoundError } from "../../shared/errors.js";

const INITIAL_DISTRIBUTIONS: DistributionRecord[] = [
  {
    id: "a581cd5d-08ce-4b59-b23d-f6a5026c5b56",
    entityType: "distribution",
    resourceId: "28443d2e-9b48-428a-aa17-52b7d9d7d72e",
    resourceName: "Bottled drinking water",
    quantity: 120,
    unit: "cartons",
    origin: "Central Relief Warehouse",
    destination: "Setia Alam Evacuation Centre",
    recipient: "Centre logistics team",
    status: "in_transit",
    scheduledAt: "2026-08-13T04:30:00.000Z",
    notes: "Priority delivery for evening intake.",
    createdAt: "2026-08-13T01:30:00.000Z",
    updatedAt: "2026-08-13T03:45:00.000Z"
  },
  {
    id: "f3fdd94a-1830-4891-a5b4-9af8c8b71e71",
    entityType: "distribution",
    resourceId: "9a4abf2d-ab9f-4929-b798-b610c76b66fd",
    resourceName: "Emergency medical kits",
    quantity: 12,
    unit: "kits",
    origin: "Kuala Lumpur Operations Hub",
    destination: "Sentul Community Clinic",
    recipient: "Clinic response unit",
    status: "delivered",
    scheduledAt: "2026-08-12T07:00:00.000Z",
    createdAt: "2026-08-12T02:00:00.000Z",
    updatedAt: "2026-08-12T08:20:00.000Z"
  }
];

const ALLOWED_TRANSITIONS: Record<DistributionStatus, DistributionStatus[]> = {
  planned: ["in_transit", "cancelled"],
  in_transit: ["delivered", "cancelled"],
  delivered: [],
  cancelled: []
};

let distributions = INITIAL_DISTRIBUTIONS.map((distribution) => ({ ...distribution }));

export async function listDistributions(): Promise<DistributionRecord[]> {
  return [...distributions]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .map((distribution) => ({ ...distribution }));
}

export async function getDistributionById(id: string): Promise<DistributionRecord> {
  const distribution = distributions.find((item) => item.id === id);

  if (!distribution) {
    throw new NotFoundError("Distribution");
  }

  return { ...distribution };
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

  distributions = [distribution, ...distributions];
  return { ...distribution };
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

  distributions = distributions.map((distribution) =>
    distribution.id === id ? updatedDistribution : distribution
  );

  return { ...updatedDistribution };
}

export function resetDistributionsForTests(): void {
  distributions = INITIAL_DISTRIBUTIONS.map((distribution) => ({ ...distribution }));
}
