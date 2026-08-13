import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { CreateVolunteerInput, UpdateVolunteerInput, VolunteerRecord } from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { dynamoDb } from "../../config/dynamodb.js";
import { env } from "../../config/env.js";
import { NotFoundError } from "../../shared/errors.js";

const tableName = env.DYNAMODB_TABLE_NAME;
export async function listVolunteers(): Promise<VolunteerRecord[]> { const result = await dynamoDb.send(new ScanCommand({ TableName: tableName, FilterExpression: "begins_with(id, :prefix)", ExpressionAttributeValues: { ":prefix": "volunteer#" } })); return ((result.Items ?? []) as VolunteerRecord[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
async function getVolunteer(id: string): Promise<VolunteerRecord> { const result = await dynamoDb.send(new GetCommand({ TableName: tableName, Key: { id } })); if (!result.Item) throw new NotFoundError("Volunteer"); return result.Item as VolunteerRecord; }
export async function createVolunteer(input: CreateVolunteerInput): Promise<VolunteerRecord> { const timestamp = new Date().toISOString(); const volunteer: VolunteerRecord = { id: `volunteer#${randomUUID()}`, ...input, availability: input.availability ?? "available", assignedTask: "", taskLocation: "", createdAt: timestamp, updatedAt: timestamp }; await dynamoDb.send(new PutCommand({ TableName: tableName, Item: volunteer, ConditionExpression: "attribute_not_exists(id)" })); return volunteer; }
export async function updateVolunteer(id: string, input: UpdateVolunteerInput): Promise<VolunteerRecord> {
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
  await dynamoDb.send(new PutCommand({ TableName: tableName, Item: updated, ConditionExpression: "attribute_exists(id)" }));
  return updated;
}
