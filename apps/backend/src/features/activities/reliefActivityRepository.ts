import type {
  DistributionRecord,
  ReliefActivityRecord,
  ReliefActivityResponse,
  ReliefActivityStatus,
  ResourceRecord
} from "@ddac/shared";
import { listDistributions } from "../distributions/distributionRepository.js";
import { listResources } from "../resources/resourceRepository.js";

function getDistributionActivityStatus(distribution: DistributionRecord): ReliefActivityStatus {
  if (distribution.status === "delivered" || distribution.status === "cancelled") {
    return "completed";
  }

  return "active";
}

function toDistributionActivity(distribution: DistributionRecord): ReliefActivityRecord {
  return {
    id: `distribution-${distribution.id}`,
    entityType: "relief_activity",
    activityType: "distribution",
    title: `${distribution.resourceName} to ${distribution.destination}`,
    description: `${distribution.quantity} ${distribution.unit} for ${distribution.recipient} - ${distribution.status.replace("_", " ")}.`,
    location: distribution.destination,
    status: getDistributionActivityStatus(distribution),
    occurredAt: distribution.updatedAt
  };
}

function toInventoryAlert(resource: ResourceRecord): ReliefActivityRecord {
  return {
    id: `inventory-${resource.id}`,
    entityType: "relief_activity",
    activityType: "inventory_alert",
    title: `${resource.name} needs attention`,
    description: `${resource.quantity} ${resource.unit} remain at ${resource.location}.`,
    location: resource.location,
    status: "attention",
    occurredAt: resource.updatedAt
  };
}

export async function getReliefActivities(): Promise<ReliefActivityResponse> {
  const [distributions, resources] = await Promise.all([listDistributions(), listResources()]);
  const distributionActivities = distributions.map(toDistributionActivity);
  const inventoryAlerts = resources
    .filter((resource) => resource.stockStatus !== "available")
    .map(toInventoryAlert);

  return {
    data: [...distributionActivities, ...inventoryAlerts].sort((left, right) =>
      right.occurredAt.localeCompare(left.occurredAt)
    ),
    summary: {
      activeDistributions: distributions.filter(
        (distribution) => distribution.status === "planned" || distribution.status === "in_transit"
      ).length,
      deliveredDistributions: distributions.filter(
        (distribution) => distribution.status === "delivered"
      ).length,
      resourcesNeedingAttention: resources.filter(
        (resource) => resource.stockStatus !== "available"
      ).length
    }
  };
}
