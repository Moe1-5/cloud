import type {
  CoordinatorEmergencyUpdateInput,
  CreateEmergencyRequestInput,
  EmergencyRequestRecord,
  EmergencyRequestStatus,
  UpdateEmergencyRequestInput
} from "@ddac/shared";
import { randomUUID } from "node:crypto";
import { AppError, NotFoundError } from "../../shared/errors.js";
import { getAffectedUserProfileById } from "../profiles/affectedUserProfileRepository.js";
import {
  clearRecordsForTests,
  getRecordById,
  listRecordsByEntity,
  putRecord
} from "../../shared/dynamoRepository.js";

const ALLOWED_TRANSITIONS: Record<EmergencyRequestStatus, EmergencyRequestStatus[]> = {
  submitted: ["under_review"],
  under_review: ["assigned"],
  assigned: ["in_progress"],
  in_progress: ["resolved"],
  resolved: [],
  cancelled: []
};

function cloneRequest(request: EmergencyRequestRecord): EmergencyRequestRecord {
  return {
    ...request,
    statusHistory: request.statusHistory.map((event) => ({ ...event }))
  };
}

export async function listEmergencyRequests(
  requesterId?: string
): Promise<EmergencyRequestRecord[]> {
  const requests = await listRecordsByEntity<EmergencyRequestRecord>(
    "emergency_request",
    "updatedAt"
  );
  return requests
    .filter((request) => !requesterId || request.requesterId === requesterId)
    .map(cloneRequest);
}

export async function getEmergencyRequestById(id: string): Promise<EmergencyRequestRecord> {
  return cloneRequest(
    await getRecordById<EmergencyRequestRecord>(id, "emergency_request", "Emergency request")
  );
}

export async function createEmergencyRequest(
  input: CreateEmergencyRequestInput
): Promise<EmergencyRequestRecord> {
  const requester = await getAffectedUserProfileById(input.requesterId);
  const timestamp = new Date().toISOString();
  const request: EmergencyRequestRecord = {
    id: randomUUID(),
    entityType: "emergency_request",
    requesterId: requester.id,
    requesterName: requester.fullName,
    assistanceType: input.assistanceType,
    description: input.description,
    location: input.location,
    peopleAffected: input.peopleAffected,
    priority: "medium",
    status: "submitted",
    statusHistory: [
      {
        status: "submitted",
        actor: "affected_user",
        occurredAt: timestamp
      }
    ],
    createdAt: timestamp,
    updatedAt: timestamp
  };

  return cloneRequest(await putRecord(request));
}

function assertAffectedUserCanChange(request: EmergencyRequestRecord, requesterId: string): void {
  if (request.requesterId !== requesterId) {
    throw new AppError("This emergency request belongs to another affected user.", 403);
  }

  if (request.status !== "submitted" && request.status !== "under_review") {
    throw new AppError("This emergency request can no longer be changed by the requester.", 409);
  }
}

export async function updateEmergencyRequest(
  id: string,
  input: UpdateEmergencyRequestInput
): Promise<EmergencyRequestRecord> {
  const currentRequest = await getEmergencyRequestById(id);
  assertAffectedUserCanChange(currentRequest, input.requesterId);

  const updatedRequest: EmergencyRequestRecord = {
    ...currentRequest,
    assistanceType: input.assistanceType ?? currentRequest.assistanceType,
    description: input.description ?? currentRequest.description,
    location: input.location ?? currentRequest.location,
    peopleAffected: input.peopleAffected ?? currentRequest.peopleAffected,
    updatedAt: new Date().toISOString()
  };

  return cloneRequest(await putRecord(updatedRequest));
}

export async function cancelEmergencyRequest(
  id: string,
  requesterId: string
): Promise<EmergencyRequestRecord> {
  const currentRequest = await getEmergencyRequestById(id);
  assertAffectedUserCanChange(currentRequest, requesterId);
  const cancelledRequest: EmergencyRequestRecord = {
    ...currentRequest,
    status: "cancelled",
    statusHistory: [
      ...currentRequest.statusHistory,
      {
        status: "cancelled",
        actor: "affected_user",
        occurredAt: new Date().toISOString()
      }
    ],
    updatedAt: new Date().toISOString()
  };

  return cloneRequest(await putRecord(cancelledRequest));
}

export async function updateEmergencyRequestByCoordinator(
  id: string,
  input: CoordinatorEmergencyUpdateInput
): Promise<EmergencyRequestRecord> {
  const currentRequest = await getEmergencyRequestById(id);

  if (currentRequest.status === "resolved" || currentRequest.status === "cancelled") {
    throw new AppError("Closed emergency requests cannot be changed.", 409);
  }

  if (
    input.status &&
    input.status !== currentRequest.status &&
    !ALLOWED_TRANSITIONS[currentRequest.status].includes(input.status)
  ) {
    throw new AppError(
      `Emergency request cannot move from ${currentRequest.status} to ${input.status}.`,
      409
    );
  }

  const assignedTo = input.assignedTo ?? currentRequest.assignedTo;
  const status = input.status ?? currentRequest.status;

  if (status === "assigned" && !assignedTo) {
    throw new AppError("A responsible relief officer is required before assignment.", 409);
  }

  const timestamp = new Date().toISOString();
  const statusHistory =
    status === currentRequest.status
      ? currentRequest.statusHistory
      : [
          ...currentRequest.statusHistory,
          {
            status,
            actor: "coordinator" as const,
            occurredAt: timestamp,
            note:
              status === "assigned" && assignedTo
                ? `Assigned to ${assignedTo}`
                : input.coordinatorNotes
          }
        ];
  const updatedRequest: EmergencyRequestRecord = {
    ...currentRequest,
    priority: input.priority ?? currentRequest.priority,
    status,
    assignedTo,
    coordinatorNotes: input.coordinatorNotes ?? currentRequest.coordinatorNotes,
    statusHistory,
    updatedAt: timestamp
  };

  return cloneRequest(await putRecord(updatedRequest));
}

export function resetEmergencyRequestsForTests(): void {
  clearRecordsForTests("emergency_request");
}
