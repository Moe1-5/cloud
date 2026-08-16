import { DeleteCommand, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../config/dynamodb.js";
import { env } from "../config/env.js";
import { NotFoundError } from "./errors.js";

type RepositoryRecord = {
  id: string;
  entityType: string;
  createdAt?: string;
  updatedAt?: string;
};

const testStore = new Map<string, RepositoryRecord>();

function isTestRuntime(): boolean {
  return env.APP_ENV === "test" || process.env.VITEST === "true";
}

function cloneRecord<T extends RepositoryRecord>(record: T): T {
  return { ...record };
}

function sortByTimestamp<T extends RepositoryRecord>(records: T[], field: "createdAt" | "updatedAt"): T[] {
  return [...records].sort((left, right) => {
    const leftValue = left[field] ?? "";
    const rightValue = right[field] ?? "";
    return rightValue.localeCompare(leftValue);
  });
}

export async function listRecordsByEntity<T extends RepositoryRecord>(
  entityType: string,
  sortField: "createdAt" | "updatedAt" = "createdAt"
): Promise<T[]> {
  if (isTestRuntime()) {
    return sortByTimestamp(
      [...testStore.values()].filter((record) => record.entityType === entityType) as T[],
      sortField
    ).map(cloneRecord);
  }

  const result = await dynamoDb.send(
    new ScanCommand({
      TableName: env.DYNAMODB_TABLE_NAME,
      FilterExpression: "#entityType = :entityType",
      ExpressionAttributeNames: {
        "#entityType": "entityType"
      },
      ExpressionAttributeValues: {
        ":entityType": entityType
      }
    })
  );

  return sortByTimestamp(((result.Items ?? []) as T[]).map(cloneRecord), sortField);
}

export async function getRecordById<T extends RepositoryRecord>(
  id: string,
  entityType: string,
  resourceName: string
): Promise<T> {
  if (isTestRuntime()) {
    const record = testStore.get(id);
    if (!record || record.entityType !== entityType) {
      throw new NotFoundError(resourceName);
    }
    return cloneRecord(record as T);
  }

  const result = await dynamoDb.send(
    new GetCommand({
      TableName: env.DYNAMODB_TABLE_NAME,
      Key: { id }
    })
  );

  if (!result.Item || result.Item.entityType !== entityType) {
    throw new NotFoundError(resourceName);
  }

  return cloneRecord(result.Item as T);
}

export async function putRecord<T extends RepositoryRecord>(record: T): Promise<T> {
  if (isTestRuntime()) {
    testStore.set(record.id, cloneRecord(record));
    return cloneRecord(record);
  }

  await dynamoDb.send(
    new PutCommand({
      TableName: env.DYNAMODB_TABLE_NAME,
      Item: record
    })
  );

  return cloneRecord(record);
}

export async function deleteRecordById(
  id: string,
  entityType: string,
  resourceName: string
): Promise<void> {
  await getRecordById(id, entityType, resourceName);

  if (isTestRuntime()) {
    testStore.delete(id);
    return;
  }

  await dynamoDb.send(
    new DeleteCommand({
      TableName: env.DYNAMODB_TABLE_NAME,
      Key: { id }
    })
  );
}

export function clearRecordsForTests(entityType?: string): void {
  if (!entityType) {
    testStore.clear();
    return;
  }

  for (const [id, record] of testStore.entries()) {
    if (record.entityType === entityType) {
      testStore.delete(id);
    }
  }
}
