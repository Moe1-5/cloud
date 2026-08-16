import type {
  CreateReliefOrganisationInput,
  OrganisationStatus,
  ReliefOrganisationRecord,
} from "@ddac/shared";

import {
  ORGANISATION_STATUS_VALUES,
} from "@ddac/shared";

import {
  Building2,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import type { FormEvent } from "react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createOrganisation,
  deleteOrganisation,
  listOrganisations,
  updateOrganisation,
} from "../../api/organisationsApi.js";

const initialForm: CreateReliefOrganisationInput = {
  name: "",
  organisationType: "",
  address: "",
  contactNumber: "",
  email: "",
  status: "active",
};

const statusLabels: Record<
  OrganisationStatus,
  string
> = {
  active: "Active",
  inactive: "Inactive",
};

export function OrganisationManagement() {
  const [organisations, setOrganisations] =
    useState<ReliefOrganisationRecord[]>([]);

  const [form, setForm] =
    useState<CreateReliefOrganisationInput>(
      initialForm
    );

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const activeCount = useMemo(
    () =>
      organisations.filter(
        (organisation) =>
          organisation.status === "active"
      ).length,
    [organisations]
  );

  async function refreshOrganisations() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data =
        await listOrganisations();

      setOrganisations(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load organisations."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshOrganisations();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (editingId) {
        const updated =
          await updateOrganisation(
            editingId,
            form
          );

        setOrganisations((current) =>
          current.map((organisation) =>
            organisation.id === editingId
              ? updated
              : organisation
          )
        );

        setEditingId(null);
      } else {
        const created =
          await createOrganisation(form);

        setOrganisations((current) => [
          created,
          ...current,
        ]);
      }

      setForm(initialForm);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save organisation."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(
    organisation: ReliefOrganisationRecord
  ) {
    setEditingId(organisation.id);

    setForm({
      name: organisation.name,
      organisationType:
        organisation.organisationType,
      address: organisation.address,
      contactNumber:
        organisation.contactNumber,
      email: organisation.email,
      status: organisation.status,
    });

    window.scrollTo({
      top: 200,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleStatusChange(
    organisation: ReliefOrganisationRecord,
    status: OrganisationStatus
  ) {
    setErrorMessage(null);

    try {
      const updated =
        await updateOrganisation(
          organisation.id,
          {
            status,
          }
        );

      setOrganisations((current) =>
        current.map((item) =>
          item.id === organisation.id
            ? updated
            : item
        )
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update organisation."
      );
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this organisation?"
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);

    try {
      await deleteOrganisation(id);

      setOrganisations((current) =>
        current.filter(
          (organisation) =>
            organisation.id !== id
        )
      );

      if (editingId === id) {
        cancelEdit();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete organisation."
      );
    }
  }

  return (
    <main className="app-shell">
      <section className="top-band">
        <div className="top-band__content">
          <div>
            <p className="eyebrow">
              Administration
            </p>

            <h1>
              Relief Organisation Management
            </h1>

            <p className="intro">
              Manage relief organisations that
              participate in disaster response
              and emergency support activities.
            </p>
          </div>

          <div className="status-strip">
            <div>
              <span>
                {organisations.length}
              </span>

              <small>
                Organisations
              </small>
            </div>

            <div>
              <span>{activeCount}</span>

              <small>
                Active organisations
              </small>
            </div>
          </div>
        </div>
      </section>

      <section className="workspace-grid">
        <form
          className="project-form"
          onSubmit={handleSubmit}
        >
          <div className="section-title">
            {editingId ? (
              <Pencil size={18} />
            ) : (
              <Plus size={18} />
            )}

            <h2>
              {editingId
                ? "Edit Organisation"
                : "Add Organisation"}
            </h2>
          </div>

          <label>
            Organisation name
            <input
              required
              minLength={3}
              maxLength={150}
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name:
                    event.target.value,
                })
              }
              placeholder="Malaysian Red Crescent"
            />
          </label>

          <label>
            Organisation type
            <input
              required
              minLength={2}
              maxLength={100}
              value={
                form.organisationType
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  organisationType:
                    event.target.value,
                })
              }
              placeholder="NGO"
            />
          </label>

          <label>
            Address
            <textarea
              required
              minLength={5}
              maxLength={300}
              value={form.address}
              onChange={(event) =>
                setForm({
                  ...form,
                  address:
                    event.target.value,
                })
              }
              placeholder="Organisation address"
            />
          </label>

          <label>
            Contact number
            <input
              required
              minLength={7}
              maxLength={30}
              value={
                form.contactNumber
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  contactNumber:
                    event.target.value,
                })
              }
              placeholder="03-12345678"
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({
                  ...form,
                  email:
                    event.target.value,
                })
              }
              placeholder="contact@example.org"
            />
          </label>

          <label>
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm({
                  ...form,
                  status:
                    event.target
                      .value as OrganisationStatus,
                })
              }
            >
              {ORGANISATION_STATUS_VALUES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {
                      statusLabels[
                        status
                      ]
                    }
                  </option>
                )
              )}
            </select>
          </label>

          <button
            className="primary-button"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2
                className="spin"
                size={18}
              />
            ) : editingId ? (
              <Pencil size={18} />
            ) : (
              <Plus size={18} />
            )}

            {isSaving
              ? "Saving..."
              : editingId
                ? "Update organisation"
                : "Add organisation"}
          </button>

          {editingId ? (
            <button
              className="icon-button"
              type="button"
              style={{
                width: "100%",
              }}
              onClick={cancelEdit}
            >
              <X size={18} />
              Cancel edit
            </button>
          ) : null}
        </form>

        <section className="project-list">
          <div className="list-header">
            <div className="section-title">
              <Building2 size={18} />

              <h2>
                Relief Organisations
              </h2>
            </div>

            <button
              className="icon-button"
              type="button"
              onClick={() =>
                void refreshOrganisations()
              }
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {errorMessage ? (
            <div className="error-banner">
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="loading-state">
              <Loader2
                className="spin"
                size={24}
              />

              Loading organisations
            </div>
          ) : organisations.length === 0 ? (
            <div className="empty-state">
              <Building2 size={32} />

              <h3>
                No relief organisations
              </h3>

              <p>
                Add the first relief
                organisation using the form.
              </p>
            </div>
          ) : (
            <div className="records">
              {organisations.map(
                (organisation) => (
                  <article
                    key={
                      organisation.id
                    }
                    className="record-card"
                  >
                    <div className="record-card__main">
                      <div>
                        <h3>
                          {
                            organisation.name
                          }
                        </h3>

                        <p>
                          {
                            organisation.address
                          }
                        </p>
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          className="icon-button"
                          type="button"
                          onClick={() =>
                            handleEdit(
                              organisation
                            )
                          }
                        >
                          <Pencil
                            size={18}
                          />
                        </button>

                        <button
                          className="icon-button danger"
                          type="button"
                          onClick={() =>
                            void handleDelete(
                              organisation.id
                            )
                          }
                        >
                          <Trash2
                            size={18}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="record-meta">
                      <span>
                        {
                          organisation.organisationType
                        }
                      </span>

                      <span>
                        {
                          organisation.contactNumber
                        }
                      </span>

                      <span>
                        {
                          organisation.email
                        }
                      </span>

                      <span>
                        {
                          statusLabels[
                            organisation.status
                          ]
                        }
                      </span>
                    </div>

                    <div className="segmented-control">
                      {ORGANISATION_STATUS_VALUES.map(
                        (status) => (
                          <button
                            key={
                              status
                            }
                            type="button"
                            className={
                              organisation.status ===
                              status
                                ? "selected"
                                : ""
                            }
                            onClick={() =>
                              void handleStatusChange(
                                organisation,
                                status
                              )
                            }
                          >
                            {
                              statusLabels[
                                status
                              ]
                            }
                          </button>
                        )
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}