import { addAssistance, createVictim, getVictim, listVictims, updateVictim } from "../victims/victimRepository.js";
import {
  addAssistanceSchema,
  createVictimSchema,
  updateVictimSchema,
  victimIdSchema
} from "../victims/victimSchemas.js";
import { createVolunteer, listVolunteers, updateVolunteer } from "../volunteers/volunteerRepository.js";
import {
  createVolunteerSchema,
  updateVolunteerSchema,
  volunteerIdSchema
} from "../volunteers/volunteerSchemas.js";
import type { AuthTokenPayload } from "../auth/token.js";
import { AppError } from "../../shared/errors.js";
import { publishAssistanceRecorded } from "./publishAssistanceEvent.js";

export type PeopleApiRequest = {
  method: string;
  path: string;
  query: Record<string, string | undefined>;
  body: unknown;
  auth: AuthTokenPayload;
  requestId: string;
};

export type PeopleApiResult = {
  statusCode: number;
  body: { data: unknown };
};

function victimIdFromPath(path: string): string | undefined {
  return /^\/api\/victims\/(victim#[^/]+)(?:\/assistance)?$/.exec(path)?.[1];
}

function volunteerIdFromPath(path: string): string | undefined {
  return /^\/api\/volunteers\/(volunteer#[^/]+)$/.exec(path)?.[1];
}

export async function handlePeopleApiRequest(request: PeopleApiRequest): Promise<PeopleApiResult> {
  const method = request.method.toUpperCase();
  const victimId = victimIdFromPath(request.path);
  const volunteerId = volunteerIdFromPath(request.path);

  if (method === "GET" && request.path === "/api/victims") {
    return { statusCode: 200, body: { data: await listVictims(request.query.search ?? "") } };
  }

  if (method === "POST" && request.path === "/api/victims") {
    return { statusCode: 201, body: { data: await createVictim(createVictimSchema.parse(request.body)) } };
  }

  if (method === "GET" && victimId) {
    return { statusCode: 200, body: { data: await getVictim(victimIdSchema.parse({ id: victimId }).id) } };
  }

  if (method === "PATCH" && victimId) {
    return {
      statusCode: 200,
      body: { data: await updateVictim(victimIdSchema.parse({ id: victimId }).id, updateVictimSchema.parse(request.body)) }
    };
  }

  if (method === "POST" && victimId && request.path.endsWith("/assistance")) {
    const id = victimIdSchema.parse({ id: victimId }).id;
    const victim = await addAssistance(id, addAssistanceSchema.parse(request.body));
    await publishAssistanceRecorded({ victim, actor: request.auth, requestId: request.requestId });
    return { statusCode: 201, body: { data: victim } };
  }

  if (method === "GET" && request.path === "/api/volunteers") {
    return { statusCode: 200, body: { data: await listVolunteers() } };
  }

  if (method === "POST" && request.path === "/api/volunteers") {
    return { statusCode: 201, body: { data: await createVolunteer(createVolunteerSchema.parse(request.body)) } };
  }

  if (method === "PATCH" && volunteerId) {
    return {
      statusCode: 200,
      body: { data: await updateVolunteer(volunteerIdSchema.parse({ id: volunteerId }).id, updateVolunteerSchema.parse(request.body)) }
    };
  }

  throw new AppError("The requested victim or volunteer route was not found.", 404);
}
