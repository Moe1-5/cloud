import type {
  ActivityLogRecord,
  CreateActivityLogInput,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";
import {
  clearRecordsForTests,
  listRecordsByEntity,
  putRecord,
} from "../../shared/dynamoRepository.js";

export async function listActivityLogs(): Promise<
  ActivityLogRecord[]
> {
  return listRecordsByEntity<ActivityLogRecord>(
    "activityLog",
    "createdAt"
  );
}

export async function createActivityLog(
  input: CreateActivityLogInput
): Promise<ActivityLogRecord> {
  const log: ActivityLogRecord = {
    id: randomUUID(),
    entityType: "activityLog",

    action: input.action,
    targetEntity: input.targetEntity,

    userName: input.userName,

    description: input.description,

    createdAt: new Date().toISOString(),

    ...(input.targetId
      ? {
          targetId: input.targetId,
        }
      : {}),

    ...(input.userId
      ? {
          userId: input.userId,
        }
      : {}),
  };

  return putRecord(log);
}

export function clearActivityLogs() {
  clearRecordsForTests("activityLog");
}
