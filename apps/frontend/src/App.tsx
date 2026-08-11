import type {
  CreateDisasterInput,
  DisasterRecord,
  DisasterSeverity,
  DisasterStatus,
} from "@ddac/shared";

import {
  DISASTER_SEVERITY_VALUES,
  DISASTER_STATUS_VALUES,
} from "@ddac/shared";

import {
  AlertTriangle,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  createDisaster,
  deleteDisaster,
  listDisasters,
  updateDisaster,
} from "./api/disastersApi.js";

const initialFormState: CreateDisasterInput = {
  title: "",
  disasterType: "",
  location: "",
  description: "",
  severity: "medium",
  status: "active",
  startDate: "",
};

const severityLabels: Record<DisasterSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const statusLabels: Record<DisasterStatus, string> = {
  active: "Active",
  monitoring: "Monitoring",
  resolved: "Resolved",
};

export function App() {
  const [disasters, setDisasters] = useState<DisasterRecord[]>([]);
  const [formState, setFormState] =
    useState<CreateDisasterInput>(initialFormState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const activeCount = useMemo(
    () =>
      disasters.filter(
        (disaster) => disaster.status === "active"
      ).length,
    [disasters]
  );

  const criticalCount = useMemo(
    () =>
      disasters.filter(
        (disaster) => disaster.severity === "critical"
      ).length,
    [disasters]
  );

  async function refreshDisasters() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextDisasters = await listDisasters();
      setDisasters(nextDisasters);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load disasters."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshDisasters();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const createdDisaster =
        await createDisaster(formState);

      setDisasters((currentDisasters) => [
        createdDisaster,
        ...currentDisasters,
      ]);

      setFormState(initialFormState);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create disaster."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(
    disaster: DisasterRecord,
    status: DisasterStatus
  ) {
    setErrorMessage(null);

    try {
      const updatedDisaster = await updateDisaster(
        disaster.id,
        {
          status,
        }
      );

      setDisasters((currentDisasters) =>
        currentDisasters.map((item) =>
          item.id === disaster.id
            ? updatedDisaster
            : item
        )
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update disaster."
      );
    }
  }

  async function handleDelete(disasterId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this disaster?"
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);

    try {
      await deleteDisaster(disasterId);

      setDisasters((currentDisasters) =>
        currentDisasters.filter(
          (disaster) => disaster.id !== disasterId
        )
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete disaster."
      );
    }
  }

  return (
    <main className="app-shell">
      <section className="top-band">
        <div className="top-band__content">
          <div>
            <p className="eyebrow">
              Disaster Relief Coordination System
            </p>

            <h1>Disaster Information Management</h1>

            <p className="intro">
              Publish and maintain current disaster information
              so relief personnel and affected communities can
              access accurate emergency updates.
            </p>
          </div>

          <div
            className="status-strip"
            aria-label="Disaster summary"
          >
            <div>
              <span>{activeCount}</span>
              <small>Active disasters</small>
            </div>

            <div>
              <span>{criticalCount}</span>
              <small>Critical alerts</small>
            </div>
          </div>
        </div>
      </section>

      <section
        className="workspace-grid"
        aria-label="Disaster management workspace"
      >
        <form
          className="project-form"
          onSubmit={handleSubmit}
        >
          <div className="section-title">
            <Plus size={18} aria-hidden="true" />
            <h2>Add Disaster</h2>
          </div>

          <label>
            Disaster title
            <input
              required
              minLength={3}
              maxLength={120}
              value={formState.title}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  title: event.target.value,
                })
              }
              placeholder="Kuala Lumpur Flash Flood"
            />
          </label>

          <label>
            Disaster type
            <input
              required
              minLength={2}
              maxLength={100}
              value={formState.disasterType}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  disasterType: event.target.value,
                })
              }
              placeholder="Flood"
            />
          </label>

          <label>
            Location
            <input
              required
              minLength={2}
              maxLength={200}
              value={formState.location}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  location: event.target.value,
                })
              }
              placeholder="Kuala Lumpur"
            />
          </label>

          <label>
            Description
            <textarea
              required
              minLength={10}
              maxLength={1500}
              value={formState.description}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  description: event.target.value,
                })
              }
              placeholder="Provide a short description of the disaster and affected areas."
            />
          </label>

          <label>
            Severity
            <select
              value={formState.severity}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  severity:
                    event.target
                      .value as DisasterSeverity,
                })
              }
            >
              {DISASTER_SEVERITY_VALUES.map(
                (severity) => (
                  <option
                    key={severity}
                    value={severity}
                  >
                    {severityLabels[severity]}
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            Status
            <select
              value={formState.status}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  status:
                    event.target.value as DisasterStatus,
                })
              }
            >
              {DISASTER_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <label>
            Start date
            <input
              required
              type="date"
              value={formState.startDate}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  startDate: event.target.value,
                })
              }
            />
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
                aria-hidden="true"
              />
            ) : (
              <Plus size={18} aria-hidden="true" />
            )}

            {isSaving
              ? "Saving..."
              : "Publish disaster"}
          </button>
        </form>

        <section
          className="project-list"
          aria-live="polite"
        >
          <div className="list-header">
            <div className="section-title">
              <AlertTriangle
                size={18}
                aria-hidden="true"
              />

              <h2>Current Disaster Records</h2>
            </div>

            <button
              className="icon-button"
              type="button"
              onClick={() => void refreshDisasters()}
              aria-label="Refresh disaster records"
            >
              <RefreshCw
                size={18}
                aria-hidden="true"
              />
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
                aria-hidden="true"
              />

              Loading disasters
            </div>
          ) : disasters.length === 0 ? (
            <div className="empty-state">
              <AlertTriangle
                size={32}
                aria-hidden="true"
              />

              <h3>No disaster records</h3>

              <p>
                Add the first disaster record using the form
                to test the disaster information workflow.
              </p>
            </div>
          ) : (
            <div className="records">
              {disasters.map((disaster) => (
                <article
                  className="record-card"
                  key={disaster.id}
                >
                  <div className="record-card__main">
                    <div>
                      <h3>{disaster.title}</h3>

                      <p>{disaster.description}</p>
                    </div>

                    <button
                      className="icon-button danger"
                      type="button"
                      onClick={() =>
                        void handleDelete(disaster.id)
                      }
                      aria-label={`Delete ${disaster.title}`}
                    >
                      <Trash2
                        size={18}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <div className="record-meta">
                    <span>
                      {disaster.disasterType}
                    </span>

                    <span>
                      <MapPin
                        size={13}
                        aria-hidden="true"
                      />{" "}
                      {disaster.location}
                    </span>

                    <span>
                      Severity:{" "}
                      {severityLabels[
                        disaster.severity
                      ]}
                    </span>

                    <span>
                      Started:{" "}
                      {new Date(
                        disaster.startDate
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div
                    className="segmented-control"
                    aria-label={`Status for ${disaster.title}`}
                  >
                    {DISASTER_STATUS_VALUES.map(
                      (status) => (
                        <button
                          key={status}
                          type="button"
                          className={
                            disaster.status === status
                              ? "selected"
                              : ""
                          }
                          onClick={() =>
                            void handleStatusChange(
                              disaster,
                              status
                            )
                          }
                        >
                          {statusLabels[status]}
                        </button>
                      )
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}