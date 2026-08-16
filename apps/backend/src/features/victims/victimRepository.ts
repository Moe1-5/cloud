import type {
  AddAssistanceInput,
  CreateVictimInput,
  UpdateVictimInput,
  VictimRecord
} from "@ddac/shared";
import { randomUUID } from "node:crypto";
import {
  clearRecordsForTests,
  getRecordById,
  listRecordsByEntity,
  putRecord
} from "../../shared/dynamoRepository.js";

type StoredVictimRecord = VictimRecord & { entityType: "victim" };

function toVictim(victim: StoredVictimRecord): VictimRecord {
  const { entityType, ...record } = victim;
  void entityType;

  return {
    ...record,
    assistanceHistory: record.assistanceHistory.map((entry) => ({ ...entry }))
  };
}

export async function listVictims(search = ""): Promise<VictimRecord[]> {
  const query = search.trim().toLowerCase();
  const victims = await listRecordsByEntity<StoredVictimRecord>("victim", "createdAt");
  return victims
    .filter(
      (victim) =>
        !query ||
        [victim.fullName, victim.identificationNumber, victim.phoneNumber].some((value) =>
          value.toLowerCase().includes(query)
        )
    )
    .map(toVictim);
}

export async function getVictim(id: string): Promise<VictimRecord> {
  return toVictim(await getRecordById<StoredVictimRecord>(id, "victim", "Victim"));
}

export async function createVictim(input: CreateVictimInput): Promise<VictimRecord> {
  const timestamp = new Date().toISOString();
  const victim: StoredVictimRecord = {
    id: `victim#${randomUUID()}`,
    entityType: "victim",
    ...input,
    status: input.status ?? "registered",
    assistanceHistory: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };
  return toVictim(await putRecord(victim));
}

export async function updateVictim(id: string, input: UpdateVictimInput): Promise<VictimRecord> {
  const current = await getRecordById<StoredVictimRecord>(id, "victim", "Victim");
  const updated: StoredVictimRecord = {
    ...current,
    fullName: input.fullName ?? current.fullName,
    phoneNumber: input.phoneNumber ?? current.phoneNumber,
    location: input.location ?? current.location,
    assistanceNeeds: input.assistanceNeeds ?? current.assistanceNeeds,
    status: input.status ?? current.status,
    updatedAt: new Date().toISOString()
  };
  return toVictim(await putRecord(updated));
}

export async function addAssistance(id: string, input: AddAssistanceInput): Promise<VictimRecord> {
  const current = await getRecordById<StoredVictimRecord>(id, "victim", "Victim");
  const entry = { id: randomUUID(), ...input, providedAt: new Date().toISOString() };
  const updated: StoredVictimRecord = {
    ...current,
    assistanceHistory: [entry, ...current.assistanceHistory],
    status: "receiving_assistance" as const,
    updatedAt: entry.providedAt
  };
  return toVictim(await putRecord(updated));
}

export function resetVictimsForTests(): void {
  clearRecordsForTests("victim");
}
