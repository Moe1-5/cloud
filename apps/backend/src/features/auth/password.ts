import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const keyLength = 32;
const digest = "sha256";
const iterations = 120000;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const hash = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("base64url");

  return `pbkdf2:${iterations}:${salt}:${hash}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, iterationValue, salt, expectedHash] = storedHash.split(":");

  if (algorithm !== "pbkdf2" || !iterationValue || !salt || !expectedHash) {
    return false;
  }

  const parsedIterations = Number.parseInt(iterationValue, 10);

  if (!Number.isSafeInteger(parsedIterations) || parsedIterations <= 0) {
    return false;
  }

  const actual = Buffer.from(
    pbkdf2Sync(password, salt, parsedIterations, keyLength, digest).toString("base64url")
  );
  const expected = Buffer.from(expectedHash);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
