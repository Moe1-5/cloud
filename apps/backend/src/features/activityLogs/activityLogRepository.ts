import type {
  ActivityLogRecord,
  CreateActivityLogInput,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";

const activityLogs: ActivityLogRecord[] = [];

export async function listActivityLogs(): Promise<
  ActivityLogRecord[]
> {
  return [...activityLogs].sort(
    (left, right) =>
      right.createdAt.localeCompare(
        left.createdAt
      )
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

  activityLogs.push(log);

  return log;
}

export function clearActivityLogs() {
  activityLogs.length = 0;
}