import type {
  CreateReliefOrganisationInput,
  ReliefOrganisationRecord,
  UpdateReliefOrganisationInput,
} from "@ddac/shared";

import { randomUUID } from "node:crypto";

import { createActivityLog } from "../activityLogs/activityLogRepository.js";
import { NotFoundError } from "../../shared/errors.js";

const organisations: ReliefOrganisationRecord[] = [];

export async function listOrganisations(): Promise<
  ReliefOrganisationRecord[]
> {
  return [...organisations].sort(
    (left, right) =>
      right.createdAt.localeCompare(
        left.createdAt
      )
  );
}

export async function getOrganisationById(
  id: string
): Promise<ReliefOrganisationRecord> {
  const organisation =
    organisations.find(
      (item) => item.id === id
    );

  if (!organisation) {
    throw new NotFoundError(
      "Relief organisation"
    );
  }

  return organisation;
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

  organisations.push(
    organisation
  );

  await createActivityLog({
    action: "create",

    targetEntity:
      "organisation",

    targetId:
      organisation.id,

    userName:
      "System Administrator",

    description:
      `Created relief organisation: ${organisation.name}`,
  });

  return organisation;
}

export async function updateOrganisation(
  id: string,
  input: UpdateReliefOrganisationInput
): Promise<ReliefOrganisationRecord> {
  const organisation =
    await getOrganisationById(
      id
    );

  const previousStatus =
    organisation.status;

  Object.assign(
    organisation,
    input,
    {
      updatedAt:
        new Date().toISOString(),
    }
  );

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
      organisation.id,

    userName:
      "System Administrator",

    description:
      statusChanged
        ? `Changed organisation status for ${organisation.name} from ${previousStatus} to ${organisation.status}`
        : `Updated relief organisation: ${organisation.name}`,
  });

  return organisation;
}

export async function deleteOrganisation(
  id: string
): Promise<void> {
  const index =
    organisations.findIndex(
      (item) =>
        item.id === id
    );

  if (index === -1) {
    throw new NotFoundError(
      "Relief organisation"
    );
  }

  const organisation =
    organisations[index];

  organisations.splice(
    index,
    1
  );

  if (organisation) {
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
}