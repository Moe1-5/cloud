import type {
  AddAssistanceInput,
  CreateVictimInput,
  UpdateVictimInput,
  VictimRecord
} from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { NotFoundError } from "../../shared/errors.js";

let victims: VictimRecord[] = [];

function cloneVictim(victim: VictimRecord): VictimRecord {
  return {
    ...victim,
    assistanceHistory: victim.assistanceHistory.map((entry) => ({ ...entry }))
  };
}

export async function listVictims(search = ""): Promise<VictimRecord[]> {
  const query = search.trim().toLowerCase();
  return [...victims]
    .filter(
      (victim) =>
        !query ||
        [victim.fullName, victim.identificationNumber, victim.phoneNumber].some((value) =>
          value.toLowerCase().includes(query)
        )
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map(cloneVictim);
}

export async function getVictim(id: string): Promise<VictimRecord> {
  const victim = victims.find((item) => item.id === id);
  if (!victim) throw new NotFoundError("Victim");
  return cloneVictim(victim);
}

export async function createVictim(input: CreateVictimInput): Promise<VictimRecord> {
  const timestamp = new Date().toISOString();
  const victim: VictimRecord = {
    id: `victim#${randomUUID()}`,
    ...input,
    status: input.status ?? "registered",
    assistanceHistory: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };
  victims = [victim, ...victims];
  return cloneVictim(victim);
}

export async function updateVictim(id: string, input: UpdateVictimInput): Promise<VictimRecord> {
  const current = await getVictim(id);
  const updated: VictimRecord = {
    ...current,
    fullName: input.fullName ?? current.fullName,
    phoneNumber: input.phoneNumber ?? current.phoneNumber,
    location: input.location ?? current.location,
    assistanceNeeds: input.assistanceNeeds ?? current.assistanceNeeds,
    status: input.status ?? current.status,
    updatedAt: new Date().toISOString()
  };
  victims = victims.map((item) => (item.id === id ? updated : item));
  return cloneVictim(updated);
}

export async function addAssistance(id: string, input: AddAssistanceInput): Promise<VictimRecord> {
  const current = await getVictim(id);
  const entry = { id: randomUUID(), ...input, providedAt: new Date().toISOString() };
  const updated = {
    ...current,
    assistanceHistory: [entry, ...current.assistanceHistory],
    status: "receiving_assistance" as const,
    updatedAt: entry.providedAt
  };
  victims = victims.map((item) => (item.id === id ? updated : item));
  return cloneVictim(updated);
}

export function resetVictimsForTests(): void {
  victims = [];
}
