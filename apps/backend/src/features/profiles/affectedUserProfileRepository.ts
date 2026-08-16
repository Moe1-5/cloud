import type {
  AffectedUserProfileRecord,
  CreateAffectedUserProfileInput,
  UpdateAffectedUserProfileInput
} from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { AppError, NotFoundError } from "../../shared/errors.js";
import {
  clearRecordsForTests,
  getRecordById,
  listRecordsByEntity,
  putRecord
} from "../../shared/dynamoRepository.js";

async function assertUniqueEmail(email: string, excludedId?: string): Promise<void> {
  const normalizedEmail = email.toLowerCase();
  const profiles = await listAffectedUserProfiles();
  const duplicateProfile = profiles.find(
    (profile) => profile.id !== excludedId && profile.email.toLowerCase() === normalizedEmail
  );

  if (duplicateProfile) {
    throw new AppError("An affected-user profile already uses this email address.", 409);
  }
}

export async function listAffectedUserProfiles(): Promise<AffectedUserProfileRecord[]> {
  const profiles = await listRecordsByEntity<AffectedUserProfileRecord>(
    "affected_user_profile",
    "createdAt"
  );
  return profiles.sort((left, right) => left.fullName.localeCompare(right.fullName));
}

export async function getAffectedUserProfileById(id: string): Promise<AffectedUserProfileRecord> {
  return getRecordById<AffectedUserProfileRecord>(
    id,
    "affected_user_profile",
    "Affected-user profile"
  );
}

export async function createAffectedUserProfile(
  input: CreateAffectedUserProfileInput
): Promise<AffectedUserProfileRecord> {
  await assertUniqueEmail(input.email);
  const timestamp = new Date().toISOString();
  const profile: AffectedUserProfileRecord = {
    id: randomUUID(),
    entityType: "affected_user_profile",
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  return putRecord(profile);
}

export async function updateAffectedUserProfile(
  id: string,
  input: UpdateAffectedUserProfileInput
): Promise<AffectedUserProfileRecord> {
  const currentProfile = await getAffectedUserProfileById(id);

  if (input.email) {
    await assertUniqueEmail(input.email, id);
  }

  const updatedProfile: AffectedUserProfileRecord = {
    ...currentProfile,
    fullName: input.fullName ?? currentProfile.fullName,
    email: input.email ?? currentProfile.email,
    phone: input.phone ?? currentProfile.phone,
    address: input.address ?? currentProfile.address,
    householdSize: input.householdSize ?? currentProfile.householdSize,
    emergencyContact: input.emergencyContact ?? currentProfile.emergencyContact,
    updatedAt: new Date().toISOString()
  };

  return putRecord(updatedProfile);
}

export function resetAffectedUserProfilesForTests(): void {
  clearRecordsForTests("affected_user_profile");
}
