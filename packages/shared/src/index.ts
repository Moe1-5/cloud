
// Starter Project Types

export const PROJECT_STATUS_VALUES = [
  "planning",
  "active",
  "completed",
] as const;

export type ProjectStatus =
  (typeof PROJECT_STATUS_VALUES)[number];

export interface ProjectRecord {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectInput = Pick<
  ProjectRecord,
  "title" | "description" | "ownerName"
> &
  Partial<Pick<ProjectRecord, "status">>;

type ProjectMutableFields = Pick<
  ProjectRecord,
  "title" | "description" | "ownerName" | "status"
>;

export type UpdateProjectInput = {
  [Key in keyof ProjectMutableFields]?:
    | ProjectMutableFields[Key]
    | undefined;
};


// API Response Types
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


// Disaster Types

export const DISASTER_SEVERITY_VALUES = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export type DisasterSeverity =
  (typeof DISASTER_SEVERITY_VALUES)[number];

export const DISASTER_STATUS_VALUES = [
  "active",
  "monitoring",
  "resolved",
] as const;

export type DisasterStatus =
  (typeof DISASTER_STATUS_VALUES)[number];

export interface DisasterRecord {
  id: string;
  entityType: "disaster";

  title: string;
  disasterType: string;
  location: string;
  description: string;

  severity: DisasterSeverity;
  status: DisasterStatus;

  startDate: string;

  createdAt: string;
  updatedAt: string;
}

export type CreateDisasterInput = Pick<
  DisasterRecord,
  | "title"
  | "disasterType"
  | "location"
  | "description"
  | "severity"
  | "startDate"
> &
  Partial<Pick<DisasterRecord, "status">>;

type DisasterMutableFields = Pick<
  DisasterRecord,
  | "title"
  | "disasterType"
  | "location"
  | "description"
  | "severity"
  | "status"
  | "startDate"
>;

export type UpdateDisasterInput = {
  [Key in keyof DisasterMutableFields]?:
    | DisasterMutableFields[Key]
    | undefined;
};


// Shelter Types

export const SHELTER_STATUS_VALUES = [
  "open",
  "full",
  "closed",
] as const;

export type ShelterStatus =
  (typeof SHELTER_STATUS_VALUES)[number];

export interface ShelterRecord {
  id: string;
  entityType: "shelter";

  name: string;
  location: string;

  capacity: number;
  currentOccupancy: number;

  contactNumber: string;

  status: ShelterStatus;

  notes: string;

  createdAt: string;
  updatedAt: string;
}

export type CreateShelterInput = Pick<
  ShelterRecord,
  | "name"
  | "location"
  | "capacity"
  | "currentOccupancy"
  | "contactNumber"
  | "notes"
> &
  Partial<Pick<ShelterRecord, "status">>;

type ShelterMutableFields = Pick<
  ShelterRecord,
  | "name"
  | "location"
  | "capacity"
  | "currentOccupancy"
  | "contactNumber"
  | "status"
  | "notes"
>;

export type UpdateShelterInput = {
  [Key in keyof ShelterMutableFields]?:
    | ShelterMutableFields[Key]
    | undefined;
};


// Relief Service Types
export const RELIEF_SERVICE_TYPE_VALUES = [
  "food",
  "medical",
] as const;

export type ReliefServiceType =
  (typeof RELIEF_SERVICE_TYPE_VALUES)[number];

export const RELIEF_SERVICE_STATUS_VALUES = [
  "available",
  "limited",
  "closed",
] as const;

export type ReliefServiceStatus =
  (typeof RELIEF_SERVICE_STATUS_VALUES)[number];

export interface ReliefServiceRecord {
  id: string;
  entityType: "reliefService";

  name: string;

  serviceType: ReliefServiceType;

  location: string;
  description: string;

  contactNumber: string;
  operatingHours: string;

  status: ReliefServiceStatus;

  createdAt: string;
  updatedAt: string;
}

export type CreateReliefServiceInput = Pick<
  ReliefServiceRecord,
  | "name"
  | "serviceType"
  | "location"
  | "description"
  | "contactNumber"
  | "operatingHours"
> &
  Partial<
    Pick<ReliefServiceRecord, "status">
  >;

type ReliefServiceMutableFields = Pick<
  ReliefServiceRecord,
  | "name"
  | "serviceType"
  | "location"
  | "description"
  | "contactNumber"
  | "operatingHours"
  | "status"
>;

export type UpdateReliefServiceInput = {
  [Key in keyof ReliefServiceMutableFields]?:
    | ReliefServiceMutableFields[Key]
    | undefined;
};


// User Account Types

// These are the main system roles.
// They should stay consistent throughout the system.

export const USER_ROLE_VALUES = [
  "admin",
  "reliefCoordinator",
  "affectedUser",
] as const;

export type UserRole =
  (typeof USER_ROLE_VALUES)[number];

export const USER_STATUS_VALUES = [
  "active",
  "inactive",
] as const;

export type UserStatus =
  (typeof USER_STATUS_VALUES)[number];

export interface UserAccountRecord {
  id: string;
  entityType: "userAccount";

  fullName: string;
  email: string;
  phoneNumber: string;

  role: UserRole;
  status: UserStatus;

  organisation: string;

  createdAt: string;
  updatedAt: string;
}

export type CreateUserAccountInput = Pick<
  UserAccountRecord,
  | "fullName"
  | "email"
  | "phoneNumber"
  | "role"
  | "organisation"
> &
  Partial<
    Pick<UserAccountRecord, "status">
  >;

type UserAccountMutableFields = Pick<
  UserAccountRecord,
  | "fullName"
  | "email"
  | "phoneNumber"
  | "role"
  | "status"
  | "organisation"
>;

export type UpdateUserAccountInput = {
  [Key in keyof UserAccountMutableFields]?:
    | UserAccountMutableFields[Key]
    | undefined;
};


// Permissions

export const PERMISSION_VALUES = [
  // Admin
  "manageUsers",
  "manageRoles",
  "manageOrganisations",
  "viewActivityLogs",
  "viewSystemReports",

  // Relief Coordinator
  "manageDisasters",
  "manageShelters",
  "manageReliefServices",
  "manageVictims",
  "manageVolunteers",
  "manageResources",
  "manageEmergencyRequests",

  // Affected User
  "viewDisasterInformation",
  "submitEmergencyRequest",
  "manageOwnProfile",
] as const;

export type Permission =
  (typeof PERMISSION_VALUES)[number];


// Default Permissions For Each Role

export const ROLE_PERMISSIONS: Record<
  UserRole,
  Permission[]
> = {
  admin: [
    "manageUsers",
    "manageRoles",
    "manageOrganisations",
    "viewActivityLogs",
    "viewSystemReports",
  ],

  reliefCoordinator: [
    "manageDisasters",
    "manageShelters",
    "manageReliefServices",

    // These can be implemented by your teammates
    "manageVictims",
    "manageVolunteers",
    "manageResources",
    "manageEmergencyRequests",

    "viewSystemReports",
  ],

  affectedUser: [
    "viewDisasterInformation",
    "submitEmergencyRequest",
    "manageOwnProfile",
  ],
};
export const ORGANISATION_STATUS_VALUES = [
  "active",
  "inactive",
] as const;

export type OrganisationStatus =
  (typeof ORGANISATION_STATUS_VALUES)[number];

export interface ReliefOrganisationRecord {
  id: string;
  entityType: "reliefOrganisation";

  name: string;
  organisationType: string;
  address: string;
  contactNumber: string;
  email: string;

  status: OrganisationStatus;

  createdAt: string;
  updatedAt: string;
}

export type CreateReliefOrganisationInput = Pick<
  ReliefOrganisationRecord,
  | "name"
  | "organisationType"
  | "address"
  | "contactNumber"
  | "email"
> &
  Partial<
    Pick<
      ReliefOrganisationRecord,
      "status"
    >
  >;

type ReliefOrganisationMutableFields =
  Pick<
    ReliefOrganisationRecord,
    | "name"
    | "organisationType"
    | "address"
    | "contactNumber"
    | "email"
    | "status"
  >;

export type UpdateReliefOrganisationInput = {
  [Key in keyof ReliefOrganisationMutableFields]?:
    | ReliefOrganisationMutableFields[Key]
    | undefined;
};


// System Activity Log Types

export const ACTIVITY_ACTION_VALUES = [
  "create",
  "update",
  "delete",
  "login",
  "logout",
  "statusChange",
] as const;

export type ActivityAction =
  (typeof ACTIVITY_ACTION_VALUES)[number];

export const ACTIVITY_ENTITY_VALUES = [
  "user",
  "disaster",
  "shelter",
  "reliefService",
  "organisation",
  "system",
] as const;

export type ActivityEntity =
  (typeof ACTIVITY_ENTITY_VALUES)[number];

export interface ActivityLogRecord {
  id: string;
  entityType: "activityLog";

  action: ActivityAction;
  targetEntity: ActivityEntity;

  targetId?: string;

  userId?: string;
  userName: string;

  description: string;

  createdAt: string;
}

export interface CreateActivityLogInput {
  action: ActivityAction;
  targetEntity: ActivityEntity;

  targetId?: string;

  userId?: string;
  userName: string;

  description: string;
}

// Victim and volunteer coordination types

export const VICTIM_STATUS_VALUES = [
  "registered",
  "receiving_assistance",
  "resolved",
] as const;

export type VictimStatus =
  (typeof VICTIM_STATUS_VALUES)[number];

export interface AssistanceEntry {
  id: string;
  description: string;
  providedBy: string;
  providedAt: string;
}

export interface VictimRecord {
  id: string;
  fullName: string;
  identificationNumber: string;
  phoneNumber: string;
  location: string;
  assistanceNeeds: string;
  status: VictimStatus;
  assistanceHistory: AssistanceEntry[];
  createdAt: string;
  updatedAt: string;
}

export type CreateVictimInput = Pick<
  VictimRecord,
  | "fullName"
  | "identificationNumber"
  | "phoneNumber"
  | "location"
  | "assistanceNeeds"
> &
  Partial<Pick<VictimRecord, "status">>;

type VictimMutableFields = Pick<
  VictimRecord,
  | "fullName"
  | "phoneNumber"
  | "location"
  | "assistanceNeeds"
  | "status"
>;

export type UpdateVictimInput = {
  [Key in keyof VictimMutableFields]?:
    | VictimMutableFields[Key]
    | undefined;
};

export type AddAssistanceInput = Pick<
  AssistanceEntry,
  "description" | "providedBy"
>;

export const VOLUNTEER_AVAILABILITY_VALUES = [
  "available",
  "assigned",
  "unavailable",
] as const;

export type VolunteerAvailability =
  (typeof VOLUNTEER_AVAILABILITY_VALUES)[number];

export interface VolunteerRecord {
  id: string;
  fullName: string;
  phoneNumber: string;
  skills: string;
  availability: VolunteerAvailability;
  assignedTask: string;
  taskLocation: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateVolunteerInput = Pick<
  VolunteerRecord,
  "fullName" | "phoneNumber" | "skills"
> &
  Partial<Pick<VolunteerRecord, "availability">>;

type VolunteerMutableFields = Pick<
  VolunteerRecord,
  | "fullName"
  | "phoneNumber"
  | "skills"
  | "availability"
  | "assignedTask"
  | "taskLocation"
>;

export type UpdateVolunteerInput = {
  [Key in keyof VolunteerMutableFields]?:
    | VolunteerMutableFields[Key]
    | undefined;
};

// Resource, distribution, and emergency operations types

export const RESOURCE_CATEGORY_VALUES = ["food", "water", "medical", "shelter", "hygiene", "other"] as const;
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

export type CreateResourceInput = Pick<ResourceRecord, "name" | "category" | "quantity" | "unit" | "location" | "reorderLevel">;
type ResourceMutableFields = Pick<ResourceRecord, "name" | "category" | "quantity" | "unit" | "location" | "reorderLevel">;
export type UpdateResourceInput = { [Key in keyof ResourceMutableFields]?: ResourceMutableFields[Key] | undefined };

export const DISTRIBUTION_STATUS_VALUES = ["planned", "in_transit", "delivered", "cancelled"] as const;
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

export type CreateDistributionInput = Pick<DistributionRecord, "resourceId" | "quantity" | "destination" | "recipient" | "scheduledAt" | "notes">;
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

export type CreateAffectedUserProfileInput = Pick<AffectedUserProfileRecord, "fullName" | "email" | "phone" | "address" | "householdSize" | "emergencyContact">;
export type UpdateAffectedUserProfileInput = { [Key in keyof CreateAffectedUserProfileInput]?: CreateAffectedUserProfileInput[Key] | undefined };

export const ASSISTANCE_TYPE_VALUES = ["evacuation", "medical", "food_water", "shelter", "rescue", "other"] as const;
export type AssistanceType = (typeof ASSISTANCE_TYPE_VALUES)[number];
export const EMERGENCY_PRIORITY_VALUES = ["low", "medium", "high", "critical"] as const;
export type EmergencyPriority = (typeof EMERGENCY_PRIORITY_VALUES)[number];
export const EMERGENCY_REQUEST_STATUS_VALUES = ["submitted", "under_review", "assigned", "in_progress", "resolved", "cancelled"] as const;
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

export type CreateEmergencyRequestInput = Pick<EmergencyRequestRecord, "requesterId" | "assistanceType" | "description" | "location" | "peopleAffected">;
type EmergencyRequestAffectedFields = Pick<EmergencyRequestRecord, "assistanceType" | "description" | "location" | "peopleAffected">;
export type UpdateEmergencyRequestInput = Pick<EmergencyRequestRecord, "requesterId"> & { [Key in keyof EmergencyRequestAffectedFields]?: EmergencyRequestAffectedFields[Key] | undefined };
type EmergencyRequestCoordinatorFields = Pick<EmergencyRequestRecord, "priority" | "status" | "assignedTo" | "coordinatorNotes">;
export type CoordinatorEmergencyUpdateInput = { [Key in keyof EmergencyRequestCoordinatorFields]?: EmergencyRequestCoordinatorFields[Key] | undefined };

export interface Student3OperationalReport {
  generatedAt: string;
  inventory: { totalResources: number; stockAlerts: number; activeLocations: number; categoryCounts: Record<ResourceCategory, number> };
  distributions: { total: number; active: number; delivered: number; cancelled: number; completionRate: number };
  affectedUsers: { registeredProfiles: number; representedHouseholdMembers: number };
  emergencyRequests: { total: number; open: number; critical: number; unassigned: number; resolved: number };
}
