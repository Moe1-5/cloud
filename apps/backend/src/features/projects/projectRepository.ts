import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import type { CreateProjectInput, ProjectRecord, UpdateProjectInput } from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import { dynamoDb } from "../../config/dynamodb.js";
import { NotFoundError } from "../../shared/errors.js";

const tableName = env.DYNAMODB_TABLE_NAME;

export async function listProjects(): Promise<ProjectRecord[]> {
  const result = await dynamoDb.send(new ScanCommand({ TableName: tableName }));
  const items = (result.Items ?? []) as ProjectRecord[];

  return [...items].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getProjectById(id: string): Promise<ProjectRecord> {
  const result = await dynamoDb.send(
    new GetCommand({
      TableName: tableName,
      Key: { id }
    })
  );

  if (!result.Item) {
    throw new NotFoundError("Project");
  }

  return result.Item as ProjectRecord;
}

export async function createProject(input: CreateProjectInput): Promise<ProjectRecord> {
  const timestamp = new Date().toISOString();
  const project: ProjectRecord = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    ownerName: input.ownerName,
    status: input.status ?? "planning",
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: tableName,
      Item: project,
      ConditionExpression: "attribute_not_exists(id)"
    })
  );

  return project;
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<ProjectRecord> {
  const timestamp = new Date().toISOString();
  const updateEntries = Object.entries({ ...input, updatedAt: timestamp }).filter(
    ([, value]) => value !== undefined
  );
  const updateExpression = updateEntries
    .map(([key]) => `#${key} = :${key}`)
    .join(", ");
  const expressionAttributeNames = Object.fromEntries(
    updateEntries.map(([key]) => [`#${key}`, key])
  );
  const expressionAttributeValues = Object.fromEntries(
    updateEntries.map(([key, value]) => [`:${key}`, value])
  );

  const result = await dynamoDb.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: "attribute_exists(id)",
      ReturnValues: "ALL_NEW"
    })
  );

  if (!result.Attributes) {
    throw new NotFoundError("Project");
  }

  return result.Attributes as ProjectRecord;
}

export async function deleteProject(id: string): Promise<void> {
  await dynamoDb.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id },
      ConditionExpression: "attribute_exists(id)"
    })
  );
}
