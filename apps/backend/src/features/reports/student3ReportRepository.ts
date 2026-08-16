import type { ResourceCategory, Student3OperationalReport } from "@ddac/shared";
import { RESOURCE_CATEGORY_VALUES } from "@ddac/shared";
import { listDistributions } from "../distributions/distributionRepository.js";
import { listEmergencyRequests } from "../emergency-requests/emergencyRequestRepository.js";
import { listAffectedUserProfiles } from "../profiles/affectedUserProfileRepository.js";
import { listResources } from "../resources/resourceRepository.js";

function createEmptyCategoryCounts(): Record<ResourceCategory, number> {
  return Object.fromEntries(RESOURCE_CATEGORY_VALUES.map((category) => [category, 0])) as Record<
    ResourceCategory,
    number
  >;
}

export async function getStudent3OperationalReport(): Promise<Student3OperationalReport> {
  const [resources, distributions, profiles, emergencyRequests] = await Promise.all([
    listResources(),
    listDistributions(),
    listAffectedUserProfiles(),
    listEmergencyRequests()
  ]);
  const categoryCounts = resources.reduce<Record<ResourceCategory, number>>(
    (counts, resource) => ({
      ...counts,
      [resource.category]: counts[resource.category] + 1
    }),
    createEmptyCategoryCounts()
  );
  const deliveredDistributions = distributions.filter(
    (distribution) => distribution.status === "delivered"
  ).length;
  const completedDistributions = distributions.filter(
    (distribution) => distribution.status === "delivered" || distribution.status === "cancelled"
  ).length;
  const completionRate =
    distributions.length === 0
      ? 0
      : Math.round((completedDistributions / distributions.length) * 100);

  return {
    generatedAt: new Date().toISOString(),
    inventory: {
      totalResources: resources.length,
      stockAlerts: resources.filter((resource) => resource.stockStatus !== "available").length,
      activeLocations: new Set(resources.map((resource) => resource.location)).size,
      categoryCounts
    },
    distributions: {
      total: distributions.length,
      active: distributions.filter(
        (distribution) => distribution.status === "planned" || distribution.status === "in_transit"
      ).length,
      delivered: deliveredDistributions,
      cancelled: distributions.filter((distribution) => distribution.status === "cancelled").length,
      completionRate
    },
    affectedUsers: {
      registeredProfiles: profiles.length,
      representedHouseholdMembers: profiles.reduce(
        (total, profile) => total + profile.householdSize,
        0
      )
    },
    emergencyRequests: {
      total: emergencyRequests.length,
      open: emergencyRequests.filter(
        (request) => request.status !== "resolved" && request.status !== "cancelled"
      ).length,
      critical: emergencyRequests.filter(
        (request) =>
          request.priority === "critical" &&
          request.status !== "resolved" &&
          request.status !== "cancelled"
      ).length,
      unassigned: emergencyRequests.filter(
        (request) =>
          !request.assignedTo && request.status !== "resolved" && request.status !== "cancelled"
      ).length,
      resolved: emergencyRequests.filter((request) => request.status === "resolved").length
    }
  };
}
