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

const INITIAL_REQUESTS: EmergencyRequestRecord[] = [
  {
    id: "48c4c799-494b-4f9f-998c-0c85900ccb4d",
    entityType: "emergency_request",
    requesterId: "b53162f1-4996-4e79-8839-3bb0767f0241",
    requesterName: "Aisha Rahman",
    assistanceType: "medical",
    description: "Elderly family member requires medication and a medical assessment.",
    location: "Taman Melawati, Kuala Lumpur",
    peopleAffected: 2,
    priority: "high",
    status: "under_review",
    coordinatorNotes: "Confirm nearby mobile clinic availability.",
    statusHistory: [
      {
        status: "submitted",
        actor: "affected_user",
        occurredAt: "2026-08-13T00:20:00.000Z"
      },
      {
        status: "under_review",
        actor: "coordinator",
        occurredAt: "2026-08-13T00:50:00.000Z",
        note: "Confirm nearby mobile clinic availability."
      }
    ],
    createdAt: "2026-08-13T00:20:00.000Z",
    updatedAt: "2026-08-13T00:50:00.000Z"
  },
  {
    id: "d389f907-6f3f-4557-afc3-c860af0494ce",
    entityType: "emergency_request",
    requesterId: "b53162f1-4996-4e79-8839-3bb0767f0241",
    requesterName: "Aisha Rahman",
    assistanceType: "food_water",
    description: "Household needs drinking water and shelf-stable food after road closure.",
    location: "Taman Melawati, Kuala Lumpur",
    peopleAffected: 4,
    priority: "medium",
    status: "assigned",
    assignedTo: "Nur Izzati - Relief Team 4",
    statusHistory: [
      {
        status: "submitted",
        actor: "affected_user",
        occurredAt: "2026-08-12T03:00:00.000Z"
      },
      {
        status: "under_review",
        actor: "coordinator",
        occurredAt: "2026-08-12T04:15:00.000Z"
      },
      {
        status: "assigned",
        actor: "coordinator",
        occurredAt: "2026-08-12T05:30:00.000Z",
        note: "Assigned to Nur Izzati - Relief Team 4"
      }
    ],
    createdAt: "2026-08-12T03:00:00.000Z",
    updatedAt: "2026-08-12T05:30:00.000Z"
  }
];

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

let requests = INITIAL_REQUESTS.map(cloneRequest);

export async function listEmergencyRequests(
  requesterId?: string
): Promise<EmergencyRequestRecord[]> {
  return [...requests]
    .filter((request) => !requesterId || request.requesterId === requesterId)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .map(cloneRequest);
}

export async function getEmergencyRequestById(id: string): Promise<EmergencyRequestRecord> {
  const request = requests.find((item) => item.id === id);

  if (!request) {
    throw new NotFoundError("Emergency request");
  }

  return cloneRequest(request);
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

  requests = [request, ...requests];
  return cloneRequest(request);
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

  requests = requests.map((request) => (request.id === id ? updatedRequest : request));
  return cloneRequest(updatedRequest);
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

  requests = requests.map((request) => (request.id === id ? cancelledRequest : request));
  return cloneRequest(cancelledRequest);
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

  requests = requests.map((request) => (request.id === id ? updatedRequest : request));
  return cloneRequest(updatedRequest);
}

export function resetEmergencyRequestsForTests(): void {
  requests = INITIAL_REQUESTS.map(cloneRequest);
}
