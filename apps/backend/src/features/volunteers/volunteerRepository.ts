import type { CreateVolunteerInput, UpdateVolunteerInput, VolunteerRecord } from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { NotFoundError } from "../../shared/errors.js";

let volunteers: VolunteerRecord[] = [];

function cloneVolunteer(volunteer: VolunteerRecord): VolunteerRecord {
  return { ...volunteer };
}

export async function listVolunteers(): Promise<VolunteerRecord[]> {
  return [...volunteers]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map(cloneVolunteer);
}

async function getVolunteer(id: string): Promise<VolunteerRecord> {
  const volunteer = volunteers.find((item) => item.id === id);
  if (!volunteer) throw new NotFoundError("Volunteer");
  return cloneVolunteer(volunteer);
}

export async function createVolunteer(input: CreateVolunteerInput): Promise<VolunteerRecord> {
  const timestamp = new Date().toISOString();
  const volunteer: VolunteerRecord = {
    id: `volunteer#${randomUUID()}`,
    ...input,
    availability: input.availability ?? "available",
    assignedTask: "",
    taskLocation: "",
    createdAt: timestamp,
    updatedAt: timestamp
  };
  volunteers = [volunteer, ...volunteers];
  return cloneVolunteer(volunteer);
}
export async function updateVolunteer(
  id: string,
  input: UpdateVolunteerInput
): Promise<VolunteerRecord> {
  const current = await getVolunteer(id);
  const updated: VolunteerRecord = {
    ...current,
    fullName: input.fullName ?? current.fullName,
    phoneNumber: input.phoneNumber ?? current.phoneNumber,
    skills: input.skills ?? current.skills,
    availability: input.availability ?? current.availability,
    assignedTask: input.assignedTask ?? current.assignedTask,
    taskLocation: input.taskLocation ?? current.taskLocation,
    updatedAt: new Date().toISOString()
  };
  volunteers = volunteers.map((item) => (item.id === id ? updated : item));
  return cloneVolunteer(updated);
}

export function resetVolunteersForTests(): void {
  volunteers = [];
}
