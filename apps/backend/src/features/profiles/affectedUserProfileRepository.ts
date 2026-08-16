import type {
  AffectedUserProfileRecord,
  CreateAffectedUserProfileInput,
  UpdateAffectedUserProfileInput
} from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { AppError, NotFoundError } from "../../shared/errors.js";

const INITIAL_PROFILES: AffectedUserProfileRecord[] = [
  {
    id: "b53162f1-4996-4e79-8839-3bb0767f0241",
    entityType: "affected_user_profile",
    fullName: "Aisha Rahman",
    email: "aisha.rahman@example.com",
    phone: "+60 12-555 0142",
    address: "Taman Melawati, Kuala Lumpur",
    householdSize: 4,
    emergencyContact: "Imran Rahman - +60 12-555 0188",
    createdAt: "2026-08-12T02:00:00.000Z",
    updatedAt: "2026-08-12T02:00:00.000Z"
  }
];

let profiles = INITIAL_PROFILES.map((profile) => ({ ...profile }));

function assertUniqueEmail(email: string, excludedId?: string): void {
  const normalizedEmail = email.toLowerCase();
  const duplicateProfile = profiles.find(
    (profile) => profile.id !== excludedId && profile.email.toLowerCase() === normalizedEmail
  );

  if (duplicateProfile) {
    throw new AppError("An affected-user profile already uses this email address.", 409);
  }
}

export async function listAffectedUserProfiles(): Promise<AffectedUserProfileRecord[]> {
  return [...profiles]
    .sort((left, right) => left.fullName.localeCompare(right.fullName))
    .map((profile) => ({ ...profile }));
}

export async function getAffectedUserProfileById(id: string): Promise<AffectedUserProfileRecord> {
  const profile = profiles.find((item) => item.id === id);

  if (!profile) {
    throw new NotFoundError("Affected-user profile");
  }

  return { ...profile };
}

export async function createAffectedUserProfile(
  input: CreateAffectedUserProfileInput
): Promise<AffectedUserProfileRecord> {
  assertUniqueEmail(input.email);
  const timestamp = new Date().toISOString();
  const profile: AffectedUserProfileRecord = {
    id: randomUUID(),
    entityType: "affected_user_profile",
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  profiles = [...profiles, profile];
  return { ...profile };
}

export async function updateAffectedUserProfile(
  id: string,
  input: UpdateAffectedUserProfileInput
): Promise<AffectedUserProfileRecord> {
  const currentProfile = await getAffectedUserProfileById(id);

  if (input.email) {
    assertUniqueEmail(input.email, id);
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

  profiles = profiles.map((profile) => (profile.id === id ? updatedProfile : profile));
  return { ...updatedProfile };
}

export function resetAffectedUserProfilesForTests(): void {
  profiles = INITIAL_PROFILES.map((profile) => ({ ...profile }));
}
