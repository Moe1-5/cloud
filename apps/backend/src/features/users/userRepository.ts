import type {
  CreateUserAccountInput,
  UpdateUserAccountInput,
  UserAccountRecord,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";

import { createActivityLog } from "../activityLogs/activityLogRepository.js";
import { NotFoundError } from "../../shared/errors.js";

const users: UserAccountRecord[] = [];

export async function listUsers(): Promise<
  UserAccountRecord[]
> {
  return [...users].sort(
    (left, right) =>
      right.createdAt.localeCompare(
        left.createdAt
      )
  );
}

export async function getUserById(
  id: string
): Promise<UserAccountRecord> {
  const user = users.find(
    (item) => item.id === id
  );

  if (!user) {
    throw new NotFoundError("User");
  }

  return user;
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

  users.push(user);

  await createActivityLog({
    action: "create",

    targetEntity: "user",

    targetId: user.id,

    userName:
      "System Administrator",

    description:
      `Created user account: ${user.fullName}`,
  });

  return user;
}

export async function updateUser(
  id: string,
  input: UpdateUserAccountInput
): Promise<UserAccountRecord> {
  const user =
    await getUserById(id);

  const previousStatus =
    user.status;

  Object.assign(
    user,
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

    targetEntity: "user",

    targetId: user.id,

    userName:
      "System Administrator",

    description: statusChanged
      ? `Changed user account status for ${user.fullName} from ${previousStatus} to ${user.status}`
      : `Updated user account: ${user.fullName}`,
  });

  return user;
}

export async function deleteUser(
  id: string
): Promise<void> {
  const index =
    users.findIndex(
      (item) =>
        item.id === id
    );

  if (index === -1) {
    throw new NotFoundError(
      "User"
    );
  }

  const user =
    users[index];

  users.splice(
    index,
    1
  );

  if (user) {
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
}