import type {
  CreateResourceInput,
  ResourceRecord,
  ResourceStockStatus,
  UpdateResourceInput
} from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { AppError, NotFoundError } from "../../shared/errors.js";

const INITIAL_RESOURCES: ResourceRecord[] = [
  {
    id: "28443d2e-9b48-428a-aa17-52b7d9d7d72e",
    entityType: "resource",
    name: "Bottled drinking water",
    category: "water",
    quantity: 840,
    unit: "cartons",
    location: "Central Relief Warehouse",
    reorderLevel: 250,
    stockStatus: "available",
    createdAt: "2026-08-13T00:00:00.000Z",
    updatedAt: "2026-08-13T00:00:00.000Z"
  },
  {
    id: "9a4abf2d-ab9f-4929-b798-b610c76b66fd",
    entityType: "resource",
    name: "Emergency medical kits",
    category: "medical",
    quantity: 36,
    unit: "kits",
    location: "Kuala Lumpur Operations Hub",
    reorderLevel: 50,
    stockStatus: "low_stock",
    createdAt: "2026-08-13T00:00:00.000Z",
    updatedAt: "2026-08-13T00:00:00.000Z"
  }
];

let resources = INITIAL_RESOURCES.map((resource) => ({ ...resource }));

function deriveStockStatus(quantity: number, reorderLevel: number): ResourceStockStatus {
  if (quantity === 0) {
    return "out_of_stock";
  }

  return quantity <= reorderLevel ? "low_stock" : "available";
}

export async function listResources(): Promise<ResourceRecord[]> {
  return [...resources]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .map((resource) => ({ ...resource }));
}

export async function getResourceById(id: string): Promise<ResourceRecord> {
  const resource = resources.find((item) => item.id === id);

  if (!resource) {
    throw new NotFoundError("Resource");
  }

  return { ...resource };
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

  resources = [resource, ...resources];
  return { ...resource };
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

  resources = resources.map((resource) => (resource.id === id ? updatedResource : resource));

  return { ...updatedResource };
}

export async function deleteResource(id: string): Promise<void> {
  await getResourceById(id);
  resources = resources.filter((resource) => resource.id !== id);
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
  resources = INITIAL_RESOURCES.map((resource) => ({ ...resource }));
}
