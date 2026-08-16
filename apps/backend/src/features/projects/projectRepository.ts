import type { CreateProjectInput, ProjectRecord, UpdateProjectInput } from "@ddac/shared";
import { randomUUID } from "node:crypto";
import {
  deleteRecordById,
  getRecordById,
  listRecordsByEntity,
  putRecord
} from "../../shared/dynamoRepository.js";

type StoredProjectRecord = ProjectRecord & { entityType: "project" };

function toProject(record: StoredProjectRecord): ProjectRecord {
  const { entityType: _entityType, ...project } = record;
  return project;
}

export async function listProjects(): Promise<ProjectRecord[]> {
  const projects = await listRecordsByEntity<StoredProjectRecord>("project", "createdAt");
  return projects.map(toProject);
}

export async function getProjectById(id: string): Promise<ProjectRecord> {
  const project = await getRecordById<StoredProjectRecord>(id, "project", "Project");
  return toProject(project);
}

export async function createProject(input: CreateProjectInput): Promise<ProjectRecord> {
  const timestamp = new Date().toISOString();
  const project: StoredProjectRecord = {
    id: randomUUID(),
    entityType: "project",
    title: input.title,
    description: input.description,
    ownerName: input.ownerName,
    status: input.status ?? "planning",
    createdAt: timestamp,
    updatedAt: timestamp
  };

  return toProject(await putRecord(project));
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<ProjectRecord> {
  const currentProject = await getRecordById<StoredProjectRecord>(id, "project", "Project");
  const updatedProject: StoredProjectRecord = {
    ...currentProject,
    title: input.title ?? currentProject.title,
    description: input.description ?? currentProject.description,
    ownerName: input.ownerName ?? currentProject.ownerName,
    status: input.status ?? currentProject.status,
    updatedAt: new Date().toISOString()
  };

  return toProject(await putRecord(updatedProject));
}

export async function deleteProject(id: string): Promise<void> {
  await deleteRecordById(id, "project", "Project");
}
