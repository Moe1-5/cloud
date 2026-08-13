import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { AddAssistanceInput, CreateVictimInput, UpdateVictimInput, VictimRecord } from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { dynamoDb } from "../../config/dynamodb.js";
import { env } from "../../config/env.js";
import { NotFoundError } from "../../shared/errors.js";

const tableName = env.DYNAMODB_TABLE_NAME;

export async function listVictims(search = ""): Promise<VictimRecord[]> {
  const result = await dynamoDb.send(new ScanCommand({ TableName: tableName, FilterExpression: "begins_with(id, :prefix)", ExpressionAttributeValues: { ":prefix": "victim#" } }));
  const query = search.trim().toLowerCase();
  return ((result.Items ?? []) as VictimRecord[]).filter((victim) => !query || [victim.fullName, victim.identificationNumber, victim.phoneNumber].some((value) => value.toLowerCase().includes(query))).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getVictim(id: string): Promise<VictimRecord> {
  const result = await dynamoDb.send(new GetCommand({ TableName: tableName, Key: { id } }));
  if (!result.Item) throw new NotFoundError("Victim");
  return result.Item as VictimRecord;
}

export async function createVictim(input: CreateVictimInput): Promise<VictimRecord> {
  const timestamp = new Date().toISOString();
  const victim: VictimRecord = { id: `victim#${randomUUID()}`, ...input, status: input.status ?? "registered", assistanceHistory: [], createdAt: timestamp, updatedAt: timestamp };
  await dynamoDb.send(new PutCommand({ TableName: tableName, Item: victim, ConditionExpression: "attribute_not_exists(id)" }));
  return victim;
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
  await dynamoDb.send(new PutCommand({ TableName: tableName, Item: updated, ConditionExpression: "attribute_exists(id)" }));
  return updated;
}

export async function addAssistance(id: string, input: AddAssistanceInput): Promise<VictimRecord> {
  const current = await getVictim(id);
  const entry = { id: randomUUID(), ...input, providedAt: new Date().toISOString() };
  const updated = { ...current, assistanceHistory: [entry, ...current.assistanceHistory], status: "receiving_assistance" as const, updatedAt: entry.providedAt };
  await dynamoDb.send(new PutCommand({ TableName: tableName, Item: updated, ConditionExpression: "attribute_exists(id)" }));
  return updated;
}
