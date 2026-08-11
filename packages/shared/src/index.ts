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
