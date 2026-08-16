import type {
  CreateReliefServiceInput,
  ReliefServiceRecord,
  ReliefServiceStatus,
  ReliefServiceType,
} from "@ddac/shared";

import {
  RELIEF_SERVICE_STATUS_VALUES,
  RELIEF_SERVICE_TYPE_VALUES,
} from "@ddac/shared";

import {
  Clock,
  HeartPulse,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Soup,
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
  createReliefService,
  deleteReliefService,
  listReliefServices,
  updateReliefService,
} from "../../api/reliefServicesApi.js";

const initialForm: CreateReliefServiceInput = {
  name: "",
  serviceType: "food",
  location: "",
  description: "",
  contactNumber: "",
  operatingHours: "",
  status: "available",
};

const typeLabels: Record<
  ReliefServiceType,
  string
> = {
  food: "Food Distribution",
  medical: "Medical Service",
};

const statusLabels: Record<
  ReliefServiceStatus,
  string
> = {
  available: "Available",
  limited: "Limited",
  closed: "Closed",
};

export function ReliefServicesManagement() {
  const [services, setServices] =
    useState<ReliefServiceRecord[]>([]);

  const [form, setForm] =
    useState<CreateReliefServiceInput>(
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

  const foodCount = useMemo(
    () =>
      services.filter(
        (service) =>
          service.serviceType === "food"
      ).length,
    [services]
  );

  const medicalCount = useMemo(
    () =>
      services.filter(
        (service) =>
          service.serviceType === "medical"
      ).length,
    [services]
  );

  async function refreshServices() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data =
        await listReliefServices();

      setServices(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load relief services."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshServices();
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
          await updateReliefService(
            editingId,
            form
          );

        setServices((current) =>
          current.map((service) =>
            service.id === editingId
              ? updated
              : service
          )
        );

        setEditingId(null);
      } else {
        const created =
          await createReliefService(form);

        setServices((current) => [
          created,
          ...current,
        ]);
      }

      setForm(initialForm);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save relief service."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(
    service: ReliefServiceRecord
  ) {
    setEditingId(service.id);

    setForm({
      name: service.name,
      serviceType:
        service.serviceType,
      location: service.location,
      description:
        service.description,
      contactNumber:
        service.contactNumber,
      operatingHours:
        service.operatingHours,
      status: service.status,
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
    service: ReliefServiceRecord,
    status: ReliefServiceStatus
  ) {
    setErrorMessage(null);

    try {
      const updated =
        await updateReliefService(
          service.id,
          {
            status,
          }
        );

      setServices((current) =>
        current.map((item) =>
          item.id === service.id
            ? updated
            : item
        )
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update service."
      );
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this relief service?"
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);

    try {
      await deleteReliefService(id);

      setServices((current) =>
        current.filter(
          (service) =>
            service.id !== id
        )
      );

      if (editingId === id) {
        cancelEdit();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete relief service."
      );
    }
  }

  return (
    <main className="app-shell">
      <section className="top-band">
        <div className="top-band__content">
          <div>
            <p className="eyebrow">
              Disaster Relief Coordination
              System
            </p>

            <h1>
              Relief Services Management
            </h1>

            <p className="intro">
              Manage food distribution
              points and medical services
              available to affected
              communities.
            </p>
          </div>

          <div className="status-strip">
            <div>
              <span>{foodCount}</span>
              <small>
                Food services
              </small>
            </div>

            <div>
              <span>{medicalCount}</span>
              <small>
                Medical services
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
                ? "Edit Relief Service"
                : "Add Relief Service"}
            </h2>
          </div>

          <label>
            Service name
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
              placeholder="Shah Alam Food Distribution Point"
            />
          </label>

          <label>
            Service type
            <select
              value={
                form.serviceType
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  serviceType:
                    event.target
                      .value as ReliefServiceType,
                })
              }
            >
              {RELIEF_SERVICE_TYPE_VALUES.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {
                      typeLabels[
                        type
                      ]
                    }
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            Location
            <input
              required
              value={form.location}
              onChange={(event) =>
                setForm({
                  ...form,
                  location:
                    event.target.value,
                })
              }
              placeholder="Seksyen 7, Shah Alam"
            />
          </label>

          <label>
            Description
            <textarea
              required
              minLength={5}
              maxLength={1200}
              value={
                form.description
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  description:
                    event.target.value,
                })
              }
              placeholder="Describe the food or medical assistance provided."
            />
          </label>

          <label>
            Contact number
            <input
              required
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
            Operating hours
            <input
              required
              value={
                form.operatingHours
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  operatingHours:
                    event.target.value,
                })
              }
              placeholder="8:00 AM - 8:00 PM"
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
                      .value as ReliefServiceStatus,
                })
              }
            >
              {RELIEF_SERVICE_STATUS_VALUES.map(
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
                ? "Update service"
                : "Add service"}
          </button>

          {editingId ? (
            <button
              type="button"
              className="icon-button"
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
              <HeartPulse
                size={18}
              />

              <h2>
                Relief Services
              </h2>
            </div>

            <button
              className="icon-button"
              type="button"
              onClick={() =>
                void refreshServices()
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
              Loading relief services
            </div>
          ) : services.length === 0 ? (
            <div className="empty-state">
              <HeartPulse
                size={32}
              />

              <h3>
                No relief services
              </h3>

              <p>
                Add the first food or
                medical service.
              </p>
            </div>
          ) : (
            <div className="records">
              {services.map(
                (service) => (
                  <article
                    key={service.id}
                    className="record-card"
                  >
                    <div className="record-card__main">
                      <div>
                        <h3>
                          {
                            service.name
                          }
                        </h3>

                        <p>
                          {
                            service.description
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
                              service
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
                              service.id
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
                        {service.serviceType ===
                        "food" ? (
                          <Soup
                            size={13}
                          />
                        ) : (
                          <HeartPulse
                            size={13}
                          />
                        )}{" "}
                        {
                          typeLabels[
                            service
                              .serviceType
                          ]
                        }
                      </span>

                      <span>
                        <MapPin
                          size={13}
                        />{" "}
                        {
                          service.location
                        }
                      </span>

                      <span>
                        <Clock
                          size={13}
                        />{" "}
                        {
                          service.operatingHours
                        }
                      </span>

                      <span>
                        {
                          service.contactNumber
                        }
                      </span>
                    </div>

                    <div className="segmented-control">
                      {RELIEF_SERVICE_STATUS_VALUES.map(
                        (status) => (
                          <button
                            key={
                              status
                            }
                            type="button"
                            className={
                              service.status ===
                              status
                                ? "selected"
                                : ""
                            }
                            onClick={() =>
                              void handleStatusChange(
                                service,
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