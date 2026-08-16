import type {
  CreateUserAccountInput,
  CreateUserAccountWithPasswordInput,
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
import { hashPassword } from "../auth/password.js";

type StoredUserAccountRecord =
  UserAccountRecord & {
    passwordHash?: string;
  };

type UpdateUserAccountWithPasswordInput =
  UpdateUserAccountInput & {
    password?: string | undefined;
  };

export function toPublicUser(
  user: StoredUserAccountRecord
): UserAccountRecord {
  const { passwordHash: _passwordHash, ...publicUser } =
    user;

  return publicUser;
}

export async function listUsers(): Promise<
  UserAccountRecord[]
> {
  const users =
    await listRecordsByEntity<StoredUserAccountRecord>(
      "userAccount",
      "createdAt"
    );

  return users.map(toPublicUser);
}

export async function listStoredUsers(): Promise<
  StoredUserAccountRecord[]
> {
  return listRecordsByEntity<StoredUserAccountRecord>(
    "userAccount",
    "createdAt"
  );
}

export async function getUserById(
  id: string
): Promise<UserAccountRecord> {
  const user =
    await getRecordById<StoredUserAccountRecord>(
      id,
      "userAccount",
      "User"
    );

  return toPublicUser(user);
}

export async function getStoredUserById(
  id: string
): Promise<StoredUserAccountRecord> {
  return getRecordById<StoredUserAccountRecord>(
    id,
    "userAccount",
    "User"
  );
}

export async function getStoredUserByEmail(
  email: string
): Promise<StoredUserAccountRecord | null> {
  const normalizedEmail =
    email.trim().toLowerCase();
  const users =
    await listStoredUsers();

  return (
    users.find(
      (user) =>
        user.email.toLowerCase() ===
        normalizedEmail
    ) ?? null
  );
}

export async function createUser(
  input:
    | CreateUserAccountInput
    | CreateUserAccountWithPasswordInput
): Promise<UserAccountRecord> {
  const timestamp =
    new Date().toISOString();

  const password =
    "password" in input
      ? input.password
      : undefined;

  const user: StoredUserAccountRecord = {
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

    ...(password
      ? {
          passwordHash:
            await hashPassword(password),
        }
      : {}),
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

  return toPublicUser(savedUser);
}

export async function updateUser(
  id: string,
  input: UpdateUserAccountWithPasswordInput
): Promise<UserAccountRecord> {
  const currentUser =
    await getStoredUserById(id);

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

    ...(input.password
      ? {
          passwordHash:
            await hashPassword(input.password),
        }
      : {}),
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

  return toPublicUser(savedUser);
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
