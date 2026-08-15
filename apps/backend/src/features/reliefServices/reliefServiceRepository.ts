import type {
  CreateReliefServiceInput,
  ReliefServiceRecord,
  UpdateReliefServiceInput,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";

import { createActivityLog } from "../activityLogs/activityLogRepository.js";
import { NotFoundError } from "../../shared/errors.js";

const reliefServices: ReliefServiceRecord[] = [];

export async function listReliefServices(): Promise<
  ReliefServiceRecord[]
> {
  return [...reliefServices].sort(
    (left, right) =>
      right.createdAt.localeCompare(
        left.createdAt
      )
  );
}

export async function getReliefServiceById(
  id: string
): Promise<ReliefServiceRecord> {
  const reliefService =
    reliefServices.find(
      (item) => item.id === id
    );

  if (!reliefService) {
    throw new NotFoundError(
      "Relief service"
    );
  }

  return reliefService;
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

  reliefServices.push(
    reliefService
  );

  await createActivityLog({
    action: "create",

    targetEntity:
      "reliefService",

    targetId:
      reliefService.id,

    userName:
      "System Administrator",

    description:
      `Created relief service: ${reliefService.name}`,
  });

  return reliefService;
}

export async function updateReliefService(
  id: string,
  input: UpdateReliefServiceInput
): Promise<ReliefServiceRecord> {
  const reliefService =
    await getReliefServiceById(
      id
    );

  const previousStatus =
    reliefService.status;

  Object.assign(
    reliefService,
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

    targetEntity:
      "reliefService",

    targetId:
      reliefService.id,

    userName:
      "System Administrator",

    description: statusChanged
      ? `Changed relief service status for ${reliefService.name} from ${previousStatus} to ${reliefService.status}`
      : `Updated relief service: ${reliefService.name}`,
  });

  return reliefService;
}

export async function deleteReliefService(
  id: string
): Promise<void> {
  const index =
    reliefServices.findIndex(
      (item) =>
        item.id === id
    );

  if (index === -1) {
    throw new NotFoundError(
      "Relief service"
    );
  }

  const reliefService =
    reliefServices[index];

  reliefServices.splice(
    index,
    1
  );

  if (reliefService) {
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
}