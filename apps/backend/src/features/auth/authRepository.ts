import type {
  AffectedUserRegisterInput,
  AuthSession,
  LoginInput,
  UserAccountRecord
} from "@ddac/shared";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";
import {
  createAffectedUserProfile,
  listAffectedUserProfiles
} from "../profiles/affectedUserProfileRepository.js";
import {
  createUser,
  getStoredUserByEmail,
  getStoredUserById,
  toPublicUser
} from "../users/userRepository.js";
import { verifyPassword } from "./password.js";
import { createAuthToken, getTokenExpiresAt, type AuthTokenPayload } from "./token.js";
import { createActivityLog } from "../activityLogs/activityLogRepository.js";

function createSession(user: UserAccountRecord): AuthSession {
  const expiresAt = getTokenExpiresAt();
  const token = createAuthToken(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.fullName
    },
    expiresAt
  );

  return {
    token,
    user,
    expiresAt: expiresAt.toISOString()
  };
}

async function ensureBootstrapAdmin(input: LoginInput): Promise<UserAccountRecord | null> {
  if (input.email.toLowerCase() !== env.AUTH_BOOTSTRAP_EMAIL.toLowerCase()) {
    return null;
  }

  if (input.password !== env.AUTH_BOOTSTRAP_PASSWORD) {
    return null;
  }

  const existingUser = await getStoredUserByEmail(input.email);

  if (existingUser) {
    return toPublicUser(existingUser);
  }

  return createUser({
    fullName: env.AUTH_BOOTSTRAP_NAME,
    email: env.AUTH_BOOTSTRAP_EMAIL,
    phoneNumber: "0000000000",
    role: "admin",
    status: "active",
    organisation: "System",
    password: env.AUTH_BOOTSTRAP_PASSWORD
  });
}

export async function login(input: LoginInput): Promise<AuthSession> {
  const bootstrapUser = await ensureBootstrapAdmin(input);
  const storedUser = bootstrapUser
    ? await getStoredUserByEmail(bootstrapUser.email)
    : await getStoredUserByEmail(input.email);

  if (!storedUser || storedUser.status !== "active" || !storedUser.passwordHash) {
    throw new AppError("Invalid email or password.", 401);
  }

  const passwordMatches = await verifyPassword(input.password, storedUser.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password.", 401);
  }

  const publicUser = toPublicUser(storedUser);
  const session = createSession(publicUser);

  await createActivityLog({
    action: "login",
    targetEntity: "system",
    userId: storedUser.id,
    userName: storedUser.fullName,
    description: `${storedUser.fullName} signed in.`
  });

  return session;
}

export async function registerAffectedUser(input: AffectedUserRegisterInput): Promise<AuthSession> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const existingUser = await getStoredUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new AppError("A user account already uses this email address.", 409);
  }

  const existingProfile = (await listAffectedUserProfiles()).find(
    (profile) => profile.email.toLowerCase() === normalizedEmail
  );

  if (existingProfile) {
    throw new AppError("An affected-user profile already uses this email address.", 409);
  }

  const user = await createUser({
    fullName: input.fullName,
    email: normalizedEmail,
    phoneNumber: input.phone,
    role: "affectedUser",
    status: "active",
    organisation: "Community",
    password: input.password
  });

  await createAffectedUserProfile({
    fullName: input.fullName,
    email: normalizedEmail,
    phone: input.phone,
    address: input.address,
    householdSize: input.householdSize,
    emergencyContact: input.emergencyContact
  });

  const session = createSession(user);

  await createActivityLog({
    action: "login",
    targetEntity: "system",
    userId: user.id,
    userName: user.fullName,
    description: `${user.fullName} registered as an affected user.`
  });

  return session;
}

export async function getSessionUser(payload: AuthTokenPayload): Promise<UserAccountRecord> {
  const user = await getStoredUserById(payload.sub);

  if (user.status !== "active") {
    throw new AppError("This user account is inactive.", 403);
  }

  return toPublicUser(user);
}
