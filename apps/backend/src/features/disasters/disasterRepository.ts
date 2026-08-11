import type {
  CreateDisasterInput,
  DisasterRecord,
  UpdateDisasterInput,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";
import { NotFoundError } from "../../shared/errors.js";

const disasters: DisasterRecord[] = [];

export async function listDisasters(): Promise<DisasterRecord[]> {
  return [...disasters].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt)
  );
}

export async function getDisasterById(
  id: string
): Promise<DisasterRecord> {
  const disaster = disasters.find((item) => item.id === id);

  if (!disaster) {
    throw new NotFoundError("Disaster");
  }

  return disaster;
}

export async function createDisaster(
  input: CreateDisasterInput
): Promise<DisasterRecord> {
  const timestamp = new Date().toISOString();

  const disaster: DisasterRecord = {
    id: randomUUID(),
    entityType: "disaster",
    title: input.title,
    disasterType: input.disasterType,
    location: input.location,
    description: input.description,
    severity: input.severity,
    status: input.status ?? "active",
    startDate: input.startDate,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  disasters.push(disaster);

  return disaster;
}

export async function updateDisaster(
  id: string,
  input: UpdateDisasterInput
): Promise<DisasterRecord> {
  const disaster = await getDisasterById(id);

  Object.assign(disaster, input, {
    updatedAt: new Date().toISOString(),
  });

  return disaster;
}

export async function deleteDisaster(id: string): Promise<void> {
  const index = disasters.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new NotFoundError("Disaster");
  }

  disasters.splice(index, 1);
}