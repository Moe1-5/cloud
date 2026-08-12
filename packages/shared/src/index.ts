export const PROJECT_STATUS_VALUES = ["planning", "active", "completed"] as const;

export type ProjectStatus = (typeof PROJECT_STATUS_VALUES)[number];

export interface ProjectRecord {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectInput = Pick<ProjectRecord, "title" | "description" | "ownerName"> &
  Partial<Pick<ProjectRecord, "status">>;

type ProjectMutableFields = Pick<ProjectRecord, "title" | "description" | "ownerName" | "status">;

export type UpdateProjectInput = {
  [Key in keyof ProjectMutableFields]?: ProjectMutableFields[Key] | undefined;
};

export interface ApiListResponse<T> {
  data: T[];
}

export interface ApiItemResponse<T> {
  data: T;
}

export interface ApiMessageResponse {
  message: string;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    details?: unknown;
  };
}

export const RESOURCE_CATEGORY_VALUES = [
  "food",
  "water",
  "medical",
  "shelter",
  "hygiene",
  "other"
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORY_VALUES)[number];

export const RESOURCE_STOCK_STATUS_VALUES = ["available", "low_stock", "out_of_stock"] as const;

export type ResourceStockStatus = (typeof RESOURCE_STOCK_STATUS_VALUES)[number];

export interface ResourceRecord {
  id: string;
  entityType: "resource";
  name: string;
  category: ResourceCategory;
  quantity: number;
  unit: string;
  location: string;
  reorderLevel: number;
  stockStatus: ResourceStockStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateResourceInput = Pick<
  ResourceRecord,
  "name" | "category" | "quantity" | "unit" | "location" | "reorderLevel"
>;

type ResourceMutableFields = Pick<
  ResourceRecord,
  "name" | "category" | "quantity" | "unit" | "location" | "reorderLevel"
>;

export type UpdateResourceInput = {
  [Key in keyof ResourceMutableFields]?: ResourceMutableFields[Key] | undefined;
};

export const DISTRIBUTION_STATUS_VALUES = [
  "planned",
  "in_transit",
  "delivered",
  "cancelled"
] as const;

export type DistributionStatus = (typeof DISTRIBUTION_STATUS_VALUES)[number];

export interface DistributionRecord {
  id: string;
  entityType: "distribution";
  resourceId: string;
  resourceName: string;
  quantity: number;
  unit: string;
  origin: string;
  destination: string;
  recipient: string;
  status: DistributionStatus;
  scheduledAt: string;
  notes?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export type CreateDistributionInput = Pick<
  DistributionRecord,
  "resourceId" | "quantity" | "destination" | "recipient" | "scheduledAt" | "notes"
>;

export type UpdateDistributionStatusInput = Pick<DistributionRecord, "status">;

export const RELIEF_ACTIVITY_STATUS_VALUES = ["active", "attention", "completed"] as const;

export type ReliefActivityStatus = (typeof RELIEF_ACTIVITY_STATUS_VALUES)[number];

export const RELIEF_ACTIVITY_TYPE_VALUES = ["distribution", "inventory_alert"] as const;

export type ReliefActivityType = (typeof RELIEF_ACTIVITY_TYPE_VALUES)[number];

export interface ReliefActivityRecord {
  id: string;
  entityType: "relief_activity";
  activityType: ReliefActivityType;
  title: string;
  description: string;
  location: string;
  status: ReliefActivityStatus;
  occurredAt: string;
}

export interface ReliefActivitySummary {
  activeDistributions: number;
  deliveredDistributions: number;
  resourcesNeedingAttention: number;
}

export interface ReliefActivityResponse {
  data: ReliefActivityRecord[];
  summary: ReliefActivitySummary;
}

export interface AffectedUserProfileRecord {
  id: string;
  entityType: "affected_user_profile";
  fullName: string;
  email: string;
  phone: string;
  address: string;
  householdSize: number;
  emergencyContact: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateAffectedUserProfileInput = Pick<
  AffectedUserProfileRecord,
  "fullName" | "email" | "phone" | "address" | "householdSize" | "emergencyContact"
>;

export type UpdateAffectedUserProfileInput = {
  [Key in keyof CreateAffectedUserProfileInput]?: CreateAffectedUserProfileInput[Key] | undefined;
};

export const ASSISTANCE_TYPE_VALUES = [
  "evacuation",
  "medical",
  "food_water",
  "shelter",
  "rescue",
  "other"
] as const;

export type AssistanceType = (typeof ASSISTANCE_TYPE_VALUES)[number];

export const EMERGENCY_PRIORITY_VALUES = ["low", "medium", "high", "critical"] as const;

export type EmergencyPriority = (typeof EMERGENCY_PRIORITY_VALUES)[number];

export const EMERGENCY_REQUEST_STATUS_VALUES = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
  "cancelled"
] as const;

export type EmergencyRequestStatus = (typeof EMERGENCY_REQUEST_STATUS_VALUES)[number];

export interface EmergencyRequestStatusEvent {
  status: EmergencyRequestStatus;
  actor: "affected_user" | "coordinator" | "system";
  occurredAt: string;
  note?: string | undefined;
}

export interface EmergencyRequestRecord {
  id: string;
  entityType: "emergency_request";
  requesterId: string;
  requesterName: string;
  assistanceType: AssistanceType;
  description: string;
  location: string;
  peopleAffected: number;
  priority: EmergencyPriority;
  status: EmergencyRequestStatus;
  assignedTo?: string | undefined;
  coordinatorNotes?: string | undefined;
  statusHistory: EmergencyRequestStatusEvent[];
  createdAt: string;
  updatedAt: string;
}

export type CreateEmergencyRequestInput = Pick<
  EmergencyRequestRecord,
  "requesterId" | "assistanceType" | "description" | "location" | "peopleAffected"
>;

type EmergencyRequestAffectedFields = Pick<
  EmergencyRequestRecord,
  "assistanceType" | "description" | "location" | "peopleAffected"
>;

export type UpdateEmergencyRequestInput = Pick<EmergencyRequestRecord, "requesterId"> & {
  [Key in keyof EmergencyRequestAffectedFields]?: EmergencyRequestAffectedFields[Key] | undefined;
};

type EmergencyRequestCoordinatorFields = Pick<
  EmergencyRequestRecord,
  "priority" | "status" | "assignedTo" | "coordinatorNotes"
>;

export type CoordinatorEmergencyUpdateInput = {
  [Key in keyof EmergencyRequestCoordinatorFields]?:
    EmergencyRequestCoordinatorFields[Key] | undefined;
};

export interface Student3OperationalReport {
  generatedAt: string;
  inventory: {
    totalResources: number;
    stockAlerts: number;
    activeLocations: number;
    categoryCounts: Record<ResourceCategory, number>;
  };
  distributions: {
    total: number;
    active: number;
    delivered: number;
    cancelled: number;
    completionRate: number;
  };
  affectedUsers: {
    registeredProfiles: number;
    representedHouseholdMembers: number;
  };
  emergencyRequests: {
    total: number;
    open: number;
    critical: number;
    unassigned: number;
    resolved: number;
  };
}
