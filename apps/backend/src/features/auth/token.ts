import type { UserRole } from "@ddac/shared";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
  exp: number;
}

function base64UrlEncode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function sign(value: string): string {
  return createHmac("sha256", env.JWT_SECRET).update(value).digest("base64url");
}

function parseDurationSeconds(value: string): number {
  const match = value.match(/^(\d+)([smhd])?$/);

  if (!match) {
    return 7 * 24 * 60 * 60;
  }

  const amount = Number.parseInt(match[1] ?? "7", 10);
  const unit = match[2] ?? "s";
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60
  };

  return amount * (multipliers[unit] ?? 1);
}

export function getTokenExpiresAt(): Date {
  return new Date(Date.now() + parseDurationSeconds(env.JWT_EXPIRES_IN) * 1000);
}

export function createAuthToken(
  payload: Omit<AuthTokenPayload, "exp">,
  expiresAt = getTokenExpiresAt()
): string {
  const tokenPayload: AuthTokenPayload = {
    ...payload,
    exp: Math.floor(expiresAt.getTime() / 1000)
  };
  const encodedPayload = base64UrlEncode(tokenPayload);
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    throw new AppError("Invalid authentication token.", 401);
  }

  const expectedSignature = sign(encodedPayload);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new AppError("Invalid authentication token.", 401);
  }

  let payload: Partial<AuthTokenPayload>;

  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as Partial<AuthTokenPayload>;
  } catch {
    throw new AppError("Invalid authentication token.", 401);
  }

  if (
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.role !== "string" ||
    typeof payload.name !== "string" ||
    typeof payload.exp !== "number"
  ) {
    throw new AppError("Invalid authentication token.", 401);
  }

  if (payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new AppError("Authentication token has expired.", 401);
  }

  return payload as AuthTokenPayload;
}
