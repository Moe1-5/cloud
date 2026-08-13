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

export const VICTIM_STATUS_VALUES = ["registered", "receiving_assistance", "resolved"] as const;
export type VictimStatus = (typeof VICTIM_STATUS_VALUES)[number];

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

export type CreateVictimInput = Pick<VictimRecord, "fullName" | "identificationNumber" | "phoneNumber" | "location" | "assistanceNeeds"> & Partial<Pick<VictimRecord, "status">>;
type VictimMutableFields = Pick<VictimRecord, "fullName" | "phoneNumber" | "location" | "assistanceNeeds" | "status">;
export type UpdateVictimInput = { [Key in keyof VictimMutableFields]?: VictimMutableFields[Key] | undefined };
export type AddAssistanceInput = Pick<AssistanceEntry, "description" | "providedBy">;

export const VOLUNTEER_AVAILABILITY_VALUES = ["available", "assigned", "unavailable"] as const;
export type VolunteerAvailability = (typeof VOLUNTEER_AVAILABILITY_VALUES)[number];

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

export type CreateVolunteerInput = Pick<VolunteerRecord, "fullName" | "phoneNumber" | "skills"> & Partial<Pick<VolunteerRecord, "availability">>;
type VolunteerMutableFields = Pick<VolunteerRecord, "fullName" | "phoneNumber" | "skills" | "availability" | "assignedTask" | "taskLocation">;
export type UpdateVolunteerInput = { [Key in keyof VolunteerMutableFields]?: VolunteerMutableFields[Key] | undefined };
