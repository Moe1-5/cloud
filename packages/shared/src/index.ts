
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