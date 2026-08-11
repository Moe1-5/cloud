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

