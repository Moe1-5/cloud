import type {
  CreateReliefServiceInput,
  ReliefServiceRecord,
  UpdateReliefServiceInput,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";

import { createActivityLog } from "../activityLogs/activityLogRepository.js";
import {
  deleteRecordById,
  getRecordById,
  listRecordsByEntity,
  putRecord,
} from "../../shared/dynamoRepository.js";

export async function listReliefServices(): Promise<
  ReliefServiceRecord[]
> {
  return listRecordsByEntity<ReliefServiceRecord>(
    "reliefService",
    "createdAt"
  );
}

export async function getReliefServiceById(
  id: string
): Promise<ReliefServiceRecord> {
  return getRecordById<ReliefServiceRecord>(
    id,
    "reliefService",
    "Relief service"
  );
}

export async function createReliefService(
  input: CreateReliefServiceInput
): Promise<ReliefServiceRecord> {
  const timestamp =
    new Date().toISOString();

  const reliefService: ReliefServiceRecord = {
    id: randomUUID(),

    entityType: "reliefService",

    name: input.name,

    serviceType:
      input.serviceType,

    location:
      input.location,

    description:
      input.description,

    contactNumber:
      input.contactNumber,

    operatingHours:
      input.operatingHours,

    status:
      input.status ?? "available",

    createdAt:
      timestamp,

    updatedAt:
      timestamp,
  };

  const savedReliefService =
    await putRecord(reliefService);

  await createActivityLog({
    action: "create",

    targetEntity:
      "reliefService",

    targetId:
      savedReliefService.id,

    userName:
      "System Administrator",

    description:
      `Created relief service: ${savedReliefService.name}`,
  });

  return savedReliefService;
}

export async function updateReliefService(
  id: string,
  input: UpdateReliefServiceInput
): Promise<ReliefServiceRecord> {
  const currentReliefService =
    await getReliefServiceById(
      id
    );

  const previousStatus =
    currentReliefService.status;

  const reliefService: ReliefServiceRecord = {
    ...currentReliefService,
    name:
      input.name ??
      currentReliefService.name,
    serviceType:
      input.serviceType ??
      currentReliefService.serviceType,
    location:
      input.location ??
      currentReliefService.location,
    description:
      input.description ??
      currentReliefService.description,
    contactNumber:
      input.contactNumber ??
      currentReliefService.contactNumber,
    operatingHours:
      input.operatingHours ??
      currentReliefService.operatingHours,
    status:
      input.status ??
      currentReliefService.status,
    updatedAt:
      new Date().toISOString(),
  };

  const savedReliefService =
    await putRecord(reliefService);

  const statusChanged =
    input.status !== undefined &&
    input.status !== previousStatus;

  await createActivityLog({
    action: statusChanged
      ? "statusChange"
      : "update",

    targetEntity:
      "reliefService",

    targetId:
      savedReliefService.id,

    userName:
      "System Administrator",

    description: statusChanged
      ? `Changed relief service status for ${savedReliefService.name} from ${previousStatus} to ${savedReliefService.status}`
      : `Updated relief service: ${savedReliefService.name}`,
  });

  return savedReliefService;
}

export async function deleteReliefService(
  id: string
): Promise<void> {
  const reliefService =
    await getReliefServiceById(id);

  await deleteRecordById(
    id,
    "reliefService",
    "Relief service"
  );

  await createActivityLog({
    action: "delete",

    targetEntity:
      "reliefService",

    targetId:
      reliefService.id,

    userName:
      "System Administrator",

    description:
      `Deleted relief service: ${reliefService.name}`,
  });
}
