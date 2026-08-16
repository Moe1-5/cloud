import type {
  CreateUserAccountInput,
  UpdateUserAccountInput,
  UserAccountRecord,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";

import { createActivityLog } from "../activityLogs/activityLogRepository.js";
import {
  deleteRecordById,
  getRecordById,
  listRecordsByEntity,
  putRecord,
} from "../../shared/dynamoRepository.js";

export async function listUsers(): Promise<
  UserAccountRecord[]
> {
  return listRecordsByEntity<UserAccountRecord>(
    "userAccount",
    "createdAt"
  );
}

export async function getUserById(
  id: string
): Promise<UserAccountRecord> {
  return getRecordById<UserAccountRecord>(
    id,
    "userAccount",
    "User"
  );
}

export async function createUser(
  input: CreateUserAccountInput
): Promise<UserAccountRecord> {
  const timestamp =
    new Date().toISOString();

  const user: UserAccountRecord = {
    id: randomUUID(),

    entityType: "userAccount",

    fullName: input.fullName,

    email: input.email,

    phoneNumber:
      input.phoneNumber,

    role: input.role,

    status:
      input.status ?? "active",

    organisation:
      input.organisation,

    createdAt: timestamp,

    updatedAt: timestamp,
  };

  const savedUser =
    await putRecord(user);

  await createActivityLog({
    action: "create",

    targetEntity: "user",

    targetId: savedUser.id,

    userName:
      "System Administrator",

    description:
      `Created user account: ${savedUser.fullName}`,
  });

  return savedUser;
}

export async function updateUser(
  id: string,
  input: UpdateUserAccountInput
): Promise<UserAccountRecord> {
  const currentUser =
    await getUserById(id);

  const previousStatus =
    currentUser.status;

  const user: UserAccountRecord = {
    ...currentUser,
    fullName:
      input.fullName ??
      currentUser.fullName,
    email:
      input.email ??
      currentUser.email,
    phoneNumber:
      input.phoneNumber ??
      currentUser.phoneNumber,
    role:
      input.role ??
      currentUser.role,
    status:
      input.status ??
      currentUser.status,
    organisation:
      input.organisation ??
      currentUser.organisation,
    updatedAt:
      new Date().toISOString(),
  };

  const savedUser =
    await putRecord(user);

  const statusChanged =
    input.status !== undefined &&
    input.status !== previousStatus;

  await createActivityLog({
    action: statusChanged
      ? "statusChange"
      : "update",

    targetEntity: "user",

    targetId: savedUser.id,

    userName:
      "System Administrator",

    description: statusChanged
      ? `Changed user account status for ${savedUser.fullName} from ${previousStatus} to ${savedUser.status}`
      : `Updated user account: ${savedUser.fullName}`,
  });

  return savedUser;
}

export async function deleteUser(
  id: string
): Promise<void> {
  const user =
    await getUserById(id);

  await deleteRecordById(
    id,
    "userAccount",
    "User"
  );

  await createActivityLog({
    action: "delete",

    targetEntity: "user",

    targetId: user.id,

    userName:
      "System Administrator",

    description:
      `Deleted user account: ${user.fullName}`,
  });
}
