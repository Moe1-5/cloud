import type {
  CreateReliefOrganisationInput,
  ReliefOrganisationRecord,
  UpdateReliefOrganisationInput,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";

import { createActivityLog } from "../activityLogs/activityLogRepository.js";
import {
  deleteRecordById,
  getRecordById,
  listRecordsByEntity,
  putRecord,
} from "../../shared/dynamoRepository.js";

export async function listOrganisations(): Promise<
  ReliefOrganisationRecord[]
> {
  return listRecordsByEntity<ReliefOrganisationRecord>(
    "reliefOrganisation",
    "createdAt"
  );
}

export async function getOrganisationById(
  id: string
): Promise<ReliefOrganisationRecord> {
  return getRecordById<ReliefOrganisationRecord>(
    id,
    "reliefOrganisation",
    "Relief organisation"
  );
}

export async function createOrganisation(
  input: CreateReliefOrganisationInput
): Promise<ReliefOrganisationRecord> {
  const timestamp =
    new Date().toISOString();

  const organisation: ReliefOrganisationRecord =
    {
      id: randomUUID(),

      entityType:
        "reliefOrganisation",

      name:
        input.name,

      organisationType:
        input.organisationType,

      address:
        input.address,

      contactNumber:
        input.contactNumber,

      email:
        input.email,

      status:
        input.status ?? "active",

      createdAt:
        timestamp,

      updatedAt:
        timestamp,
    };

  const savedOrganisation =
    await putRecord(organisation);

  await createActivityLog({
    action: "create",

    targetEntity:
      "organisation",

    targetId:
      savedOrganisation.id,

    userName:
      "System Administrator",

    description:
      `Created relief organisation: ${savedOrganisation.name}`,
  });

  return savedOrganisation;
}

export async function updateOrganisation(
  id: string,
  input: UpdateReliefOrganisationInput
): Promise<ReliefOrganisationRecord> {
  const currentOrganisation =
    await getOrganisationById(
      id
    );

  const previousStatus =
    currentOrganisation.status;

  const organisation: ReliefOrganisationRecord =
    {
      ...currentOrganisation,
      name:
        input.name ??
        currentOrganisation.name,
      organisationType:
        input.organisationType ??
        currentOrganisation.organisationType,
      address:
        input.address ??
        currentOrganisation.address,
      contactNumber:
        input.contactNumber ??
        currentOrganisation.contactNumber,
      email:
        input.email ??
        currentOrganisation.email,
      status:
        input.status ??
        currentOrganisation.status,
      updatedAt:
        new Date().toISOString(),
    };

  const savedOrganisation =
    await putRecord(organisation);

  const statusChanged =
    input.status !== undefined &&
    input.status !== previousStatus;

  await createActivityLog({
    action: statusChanged
      ? "statusChange"
      : "update",

    targetEntity:
      "organisation",

    targetId:
      savedOrganisation.id,

    userName:
      "System Administrator",

    description:
      statusChanged
        ? `Changed organisation status for ${savedOrganisation.name} from ${previousStatus} to ${savedOrganisation.status}`
        : `Updated relief organisation: ${savedOrganisation.name}`,
  });

  return savedOrganisation;
}

export async function deleteOrganisation(
  id: string
): Promise<void> {
  const organisation =
    await getOrganisationById(id);

  await deleteRecordById(
    id,
    "reliefOrganisation",
    "Relief organisation"
  );

  await createActivityLog({
    action: "delete",

    targetEntity:
      "organisation",

    targetId:
      organisation.id,

    userName:
      "System Administrator",

    description:
      `Deleted relief organisation: ${organisation.name}`,
  });
}
