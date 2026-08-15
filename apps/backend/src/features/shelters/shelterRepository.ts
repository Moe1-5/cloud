import type {
  CreateShelterInput,
  ShelterRecord,
  UpdateShelterInput,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";

import { createActivityLog } from "../activityLogs/activityLogRepository.js";
import { NotFoundError } from "../../shared/errors.js";

const shelters: ShelterRecord[] = [];

export async function listShelters(): Promise<
  ShelterRecord[]
> {
  return [...shelters].sort(
    (left, right) =>
      right.createdAt.localeCompare(
        left.createdAt
      )
  );
}

export async function getShelterById(
  id: string
): Promise<ShelterRecord> {
  const shelter = shelters.find(
    (item) => item.id === id
  );

  if (!shelter) {
    throw new NotFoundError(
      "Shelter"
    );
  }

  return shelter;
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

  shelters.push(shelter);

  await createActivityLog({
    action: "create",

    targetEntity: "shelter",

    targetId: shelter.id,

    userName:
      "System Administrator",

    description:
      `Created shelter: ${shelter.name}`,
  });

  return shelter;
}

export async function updateShelter(
  id: string,
  input: UpdateShelterInput
): Promise<ShelterRecord> {
  const shelter =
    await getShelterById(id);

  const previousStatus =
    shelter.status;

  Object.assign(
    shelter,
    input,
    {
      updatedAt:
        new Date().toISOString(),
    }
  );

  const statusChanged =
    input.status !== undefined &&
    input.status !== previousStatus;

  await createActivityLog({
    action: statusChanged
      ? "statusChange"
      : "update",

    targetEntity: "shelter",

    targetId: shelter.id,

    userName:
      "System Administrator",

    description: statusChanged
      ? `Changed shelter status for ${shelter.name} from ${previousStatus} to ${shelter.status}`
      : `Updated shelter: ${shelter.name}`,
  });

  return shelter;
}

export async function deleteShelter(
  id: string
): Promise<void> {
  const index =
    shelters.findIndex(
      (item) =>
        item.id === id
    );

  if (index === -1) {
    throw new NotFoundError(
      "Shelter"
    );
  }

  const shelter =
    shelters[index];

  shelters.splice(
    index,
    1
  );

  if (shelter) {
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
}