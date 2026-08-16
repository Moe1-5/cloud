import type { CreateVolunteerInput, UpdateVolunteerInput, VolunteerRecord } from "@ddac/shared";
import { randomUUID } from "node:crypto";
import {
  clearRecordsForTests,
  getRecordById,
  listRecordsByEntity,
  putRecord
} from "../../shared/dynamoRepository.js";

type StoredVolunteerRecord = VolunteerRecord & { entityType: "volunteer" };

function toVolunteer(volunteer: StoredVolunteerRecord): VolunteerRecord {
  const { entityType: _entityType, ...record } = volunteer;
  return { ...record };
}

export async function listVolunteers(): Promise<VolunteerRecord[]> {
  const volunteers = await listRecordsByEntity<StoredVolunteerRecord>("volunteer", "createdAt");
  return volunteers.map(toVolunteer);
}

async function getVolunteer(id: string): Promise<VolunteerRecord> {
  return toVolunteer(await getRecordById<StoredVolunteerRecord>(id, "volunteer", "Volunteer"));
}

export async function createVolunteer(input: CreateVolunteerInput): Promise<VolunteerRecord> {
  const timestamp = new Date().toISOString();
  const volunteer: StoredVolunteerRecord = {
    id: `volunteer#${randomUUID()}`,
    entityType: "volunteer",
    ...input,
    availability: input.availability ?? "available",
    assignedTask: "",
    taskLocation: "",
    createdAt: timestamp,
    updatedAt: timestamp
  };
  return toVolunteer(await putRecord(volunteer));
}
export async function updateVolunteer(
  id: string,
  input: UpdateVolunteerInput
): Promise<VolunteerRecord> {
  const current = await getRecordById<StoredVolunteerRecord>(id, "volunteer", "Volunteer");
  const updated: StoredVolunteerRecord = {
    ...current,
    fullName: input.fullName ?? current.fullName,
    phoneNumber: input.phoneNumber ?? current.phoneNumber,
    skills: input.skills ?? current.skills,
    availability: input.availability ?? current.availability,
    assignedTask: input.assignedTask ?? current.assignedTask,
    taskLocation: input.taskLocation ?? current.taskLocation,
    updatedAt: new Date().toISOString()
  };
  return toVolunteer(await putRecord(updated));
}

export function resetVolunteersForTests(): void {
  clearRecordsForTests("volunteer");
}
