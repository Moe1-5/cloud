import type {
  CreateShelterInput,
  ShelterRecord,
  UpdateShelterInput,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";

import { createActivityLog } from "../activityLogs/activityLogRepository.js";
import {
  deleteRecordById,
  getRecordById,
  listRecordsByEntity,
  putRecord,
} from "../../shared/dynamoRepository.js";

export async function listShelters(): Promise<
  ShelterRecord[]
> {
  return listRecordsByEntity<ShelterRecord>(
    "shelter",
    "createdAt"
  );
}

export async function getShelterById(
  id: string
): Promise<ShelterRecord> {
  return getRecordById<ShelterRecord>(
    id,
    "shelter",
    "Shelter"
  );
}

export async function createShelter(
  input: CreateShelterInput
): Promise<ShelterRecord> {
  const timestamp =
    new Date().toISOString();

  const shelter: ShelterRecord = {
    id: randomUUID(),

    entityType: "shelter",

    name: input.name,

    location: input.location,

    capacity: input.capacity,

    currentOccupancy:
      input.currentOccupancy,

    contactNumber:
      input.contactNumber,

    status:
      input.status ?? "open",

    notes: input.notes,

    createdAt: timestamp,

    updatedAt: timestamp,
  };

  const savedShelter =
    await putRecord(shelter);

  await createActivityLog({
    action: "create",

    targetEntity: "shelter",

    targetId: savedShelter.id,

    userName:
      "System Administrator",

    description:
      `Created shelter: ${savedShelter.name}`,
  });

  return savedShelter;
}

export async function updateShelter(
  id: string,
  input: UpdateShelterInput
): Promise<ShelterRecord> {
  const currentShelter =
    await getShelterById(id);

  const previousStatus =
    currentShelter.status;

  const shelter: ShelterRecord = {
    ...currentShelter,
    name:
      input.name ??
      currentShelter.name,
    location:
      input.location ??
      currentShelter.location,
    capacity:
      input.capacity ??
      currentShelter.capacity,
    currentOccupancy:
      input.currentOccupancy ??
      currentShelter.currentOccupancy,
    contactNumber:
      input.contactNumber ??
      currentShelter.contactNumber,
    status:
      input.status ??
      currentShelter.status,
    notes:
      input.notes ??
      currentShelter.notes,
    updatedAt:
      new Date().toISOString(),
  };

  const savedShelter =
    await putRecord(shelter);

  const statusChanged =
    input.status !== undefined &&
    input.status !== previousStatus;

  await createActivityLog({
    action: statusChanged
      ? "statusChange"
      : "update",

    targetEntity: "shelter",

    targetId: savedShelter.id,

    userName:
      "System Administrator",

    description: statusChanged
      ? `Changed shelter status for ${savedShelter.name} from ${previousStatus} to ${savedShelter.status}`
      : `Updated shelter: ${savedShelter.name}`,
  });

  return savedShelter;
}

export async function deleteShelter(
  id: string
): Promise<void> {
  const shelter =
    await getShelterById(id);

  await deleteRecordById(
    id,
    "shelter",
    "Shelter"
  );

  await createActivityLog({
    action: "delete",

    targetEntity: "shelter",

    targetId: shelter.id,

    userName:
      "System Administrator",

    description:
      `Deleted shelter: ${shelter.name}`,
  });
}
