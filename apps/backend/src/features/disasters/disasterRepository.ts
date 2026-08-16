import type {
  CreateDisasterInput,
  DisasterRecord,
  UpdateDisasterInput,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";

import { createActivityLog } from "../activityLogs/activityLogRepository.js";
import { NotFoundError } from "../../shared/errors.js";

const disasters: DisasterRecord[] = [];

export async function listDisasters(): Promise<
  DisasterRecord[]
> {
  return [...disasters].sort(
    (left, right) =>
      right.createdAt.localeCompare(
        left.createdAt
      )
  );
}

export async function getDisasterById(
  id: string
): Promise<DisasterRecord> {
  const disaster = disasters.find(
    (item) => item.id === id
  );

  if (!disaster) {
    throw new NotFoundError(
      "Disaster"
    );
  }

  return disaster;
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

  disasters.push(
    disaster
  );

  await createActivityLog({
    action: "create",

    targetEntity:
      "disaster",

    targetId:
      disaster.id,

    userName:
      "System Administrator",

    description:
      `Created disaster record: ${disaster.title}`,
  });

  return disaster;
}

export async function updateDisaster(
  id: string,
  input: UpdateDisasterInput
): Promise<DisasterRecord> {
  const disaster =
    await getDisasterById(
      id
    );

  Object.assign(
    disaster,
    input,
    {
      updatedAt:
        new Date().toISOString(),
    }
  );

  await createActivityLog({
    action: "update",

    targetEntity:
      "disaster",

    targetId:
      disaster.id,

    userName:
      "System Administrator",

    description:
      `Updated disaster record: ${disaster.title}`,
  });

  return disaster;
}

export async function deleteDisaster(
  id: string
): Promise<void> {
  const index =
    disasters.findIndex(
      (item) =>
        item.id === id
    );

  if (index === -1) {
    throw new NotFoundError(
      "Disaster"
    );
  }

  const disaster =
    disasters[index];

  disasters.splice(
    index,
    1
  );

  if (disaster) {
    await createActivityLog({
      action:
        "delete",

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
}