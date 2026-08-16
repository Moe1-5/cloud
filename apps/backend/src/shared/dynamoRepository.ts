import { DeleteCommand, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../config/dynamodb.js";
import { env } from "../config/env.js";
import { AppError, NotFoundError } from "./errors.js";

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

function sortByTimestamp<T extends RepositoryRecord>(
  records: T[],
  field: "createdAt" | "updatedAt"
): T[] {
  return [...records].sort((left, right) => {
    const leftValue = left[field] ?? "";
    const rightValue = right[field] ?? "";
    return rightValue.localeCompare(leftValue);
  });
}

function toDatabaseError(error: unknown): AppError {
  const message = error instanceof Error ? error.message : String(error);

  return new AppError(
    "Database connection failed. Check the DynamoDB table name, region, endpoint, and AWS credentials in the root .env file.",
    503,
    { cause: message }
  );
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

  let result;

  try {
    result = await dynamoDb.send(
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
  } catch (error) {
    throw toDatabaseError(error);
  }

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

  let result;

  try {
    result = await dynamoDb.send(
      new GetCommand({
        TableName: env.DYNAMODB_TABLE_NAME,
        Key: { id }
      })
    );
  } catch (error) {
    throw toDatabaseError(error);
  }

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

  try {
    await dynamoDb.send(
      new PutCommand({
        TableName: env.DYNAMODB_TABLE_NAME,
        Item: record
      })
    );
  } catch (error) {
    throw toDatabaseError(error);
  }

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

  try {
    await dynamoDb.send(
      new DeleteCommand({
        TableName: env.DYNAMODB_TABLE_NAME,
        Key: { id }
      })
    );
  } catch (error) {
    throw toDatabaseError(error);
  }
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
