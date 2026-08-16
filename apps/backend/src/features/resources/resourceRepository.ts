import type {
  CreateResourceInput,
  ResourceRecord,
  ResourceStockStatus,
  UpdateResourceInput
} from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { AppError, NotFoundError } from "../../shared/errors.js";
import {
  clearRecordsForTests,
  deleteRecordById,
  getRecordById,
  listRecordsByEntity,
  putRecord
} from "../../shared/dynamoRepository.js";

function deriveStockStatus(quantity: number, reorderLevel: number): ResourceStockStatus {
  if (quantity === 0) {
    return "out_of_stock";
  }

  return quantity <= reorderLevel ? "low_stock" : "available";
}

export async function listResources(): Promise<ResourceRecord[]> {
  return listRecordsByEntity<ResourceRecord>("resource", "updatedAt");
}

export async function getResourceById(id: string): Promise<ResourceRecord> {
  return getRecordById<ResourceRecord>(id, "resource", "Resource");
}

export async function createResource(input: CreateResourceInput): Promise<ResourceRecord> {
  const timestamp = new Date().toISOString();
  const resource: ResourceRecord = {
    id: randomUUID(),
    entityType: "resource",
    ...input,
    stockStatus: deriveStockStatus(input.quantity, input.reorderLevel),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  return putRecord(resource);
}

export async function updateResource(
  id: string,
  input: UpdateResourceInput
): Promise<ResourceRecord> {
  const currentResource = await getResourceById(id);
  const nextResourceValues: ResourceRecord = {
    ...currentResource,
    name: input.name ?? currentResource.name,
    category: input.category ?? currentResource.category,
    quantity: input.quantity ?? currentResource.quantity,
    unit: input.unit ?? currentResource.unit,
    location: input.location ?? currentResource.location,
    reorderLevel: input.reorderLevel ?? currentResource.reorderLevel
  };
  const updatedResource: ResourceRecord = {
    ...nextResourceValues,
    stockStatus: deriveStockStatus(nextResourceValues.quantity, nextResourceValues.reorderLevel),
    updatedAt: new Date().toISOString()
  };

  return putRecord(updatedResource);
}

export async function deleteResource(id: string): Promise<void> {
  await deleteRecordById(id, "resource", "Resource");
}

export async function adjustResourceQuantity(
  id: string,
  adjustment: number
): Promise<ResourceRecord> {
  const resource = await getResourceById(id);
  const nextQuantity = resource.quantity + adjustment;

  if (nextQuantity < 0) {
    throw new AppError(
      `Only ${resource.quantity} ${resource.unit} of ${resource.name} are available.`,
      409
    );
  }

  return updateResource(id, { quantity: nextQuantity });
}

export function resetResourcesForTests(): void {
  clearRecordsForTests("resource");
}
