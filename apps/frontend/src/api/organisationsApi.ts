import type {
  ApiItemResponse,
  ApiListResponse,
  CreateReliefOrganisationInput,
  ReliefOrganisationRecord,
  UpdateReliefOrganisationInput,
} from "@ddac/shared";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "";

async function requestJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${apiBaseUrl}${path}`,
    {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    }
  );

  if (!response.ok) {
    const fallbackMessage =
      `Request failed with status ${response.status}`;

    const errorBody = await response
      .json()
      .catch(() => undefined);

    const message =
      typeof errorBody?.error?.message === "string"
        ? errorBody.error.message
        : fallbackMessage;

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function listOrganisations(): Promise<
  ReliefOrganisationRecord[]
> {
  const response =
    await requestJson<
      ApiListResponse<ReliefOrganisationRecord>
    >("/api/organisations");

  return response.data;
}

export async function createOrganisation(
  input: CreateReliefOrganisationInput
): Promise<ReliefOrganisationRecord> {
  const response =
    await requestJson<
      ApiItemResponse<ReliefOrganisationRecord>
    >("/api/organisations", {
      method: "POST",
      body: JSON.stringify(input),
    });

  return response.data;
}

export async function updateOrganisation(
  id: string,
  input: UpdateReliefOrganisationInput
): Promise<ReliefOrganisationRecord> {
  const response =
    await requestJson<
      ApiItemResponse<ReliefOrganisationRecord>
    >(`/api/organisations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });

  return response.data;
}

export async function deleteOrganisation(
  id: string
): Promise<void> {
  await requestJson<void>(
    `/api/organisations/${id}`,
    {
      method: "DELETE",
    }
  );
}