import type {
  CreateDisasterInput,
  DisasterRecord,
  UpdateDisasterInput,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";

import { createActivityLog } from "../activityLogs/activityLogRepository.js";
import {
  deleteRecordById,
  getRecordById,
  listRecordsByEntity,
  putRecord,
} from "../../shared/dynamoRepository.js";

export async function listDisasters(): Promise<
  DisasterRecord[]
> {
  return listRecordsByEntity<DisasterRecord>(
    "disaster",
    "createdAt"
  );
}

export async function getDisasterById(
  id: string
): Promise<DisasterRecord> {
  return getRecordById<DisasterRecord>(
    id,
    "disaster",
    "Disaster"
  );
}

export async function createDisaster(
  input: CreateDisasterInput
): Promise<DisasterRecord> {
  const timestamp =
    new Date().toISOString();

  const disaster: DisasterRecord = {
    id: randomUUID(),

    entityType: "disaster",

    title: input.title,

    disasterType:
      input.disasterType,

    location:
      input.location,

    description:
      input.description,

    severity:
      input.severity,

    status:
      input.status ?? "active",

    startDate:
      input.startDate,

    createdAt:
      timestamp,

    updatedAt:
      timestamp,
  };

  const savedDisaster =
    await putRecord(disaster);

  await createActivityLog({
    action: "create",

    targetEntity:
      "disaster",

    targetId:
      savedDisaster.id,

    userName:
      "System Administrator",

    description:
      `Created disaster record: ${savedDisaster.title}`,
  });

  return savedDisaster;
}

export async function updateDisaster(
  id: string,
  input: UpdateDisasterInput
): Promise<DisasterRecord> {
  const currentDisaster =
    await getDisasterById(
      id
    );

  const disaster: DisasterRecord = {
    ...currentDisaster,
    title:
      input.title ??
      currentDisaster.title,
    disasterType:
      input.disasterType ??
      currentDisaster.disasterType,
    location:
      input.location ??
      currentDisaster.location,
    description:
      input.description ??
      currentDisaster.description,
    severity:
      input.severity ??
      currentDisaster.severity,
    status:
      input.status ??
      currentDisaster.status,
    startDate:
      input.startDate ??
      currentDisaster.startDate,
    updatedAt:
      new Date().toISOString(),
  };

  const savedDisaster =
    await putRecord(disaster);

  await createActivityLog({
    action: "update",

    targetEntity:
      "disaster",

    targetId:
      savedDisaster.id,

    userName:
      "System Administrator",

    description:
      `Updated disaster record: ${savedDisaster.title}`,
  });

  return savedDisaster;
}

export async function deleteDisaster(
  id: string
): Promise<void> {
  const disaster =
    await getDisasterById(id);

  await deleteRecordById(
    id,
    "disaster",
    "Disaster"
  );

  await createActivityLog({
    action: "delete",

    targetEntity:
      "disaster",

    targetId:
      disaster.id,

    userName:
      "System Administrator",

    description:
      `Deleted disaster record: ${disaster.title}`,
  });
}
