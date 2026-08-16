import type {
  CreateDisasterInput,
  DisasterRecord,
  DisasterSeverity,
  DisasterStatus
} from "@ddac/shared";

import { DISASTER_SEVERITY_VALUES, DISASTER_STATUS_VALUES } from "@ddac/shared";

import {
  AlertTriangle,
  Eye,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X
} from "lucide-react";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  createDisaster,
  deleteDisaster,
  listDisasters,
  updateDisaster
} from "../../api/disastersApi.js";
import { RoleNavigation } from "../../layouts/RoleNavigation.js";

const initialFormState: CreateDisasterInput = {
  title: "",
  disasterType: "",
  location: "",
  description: "",
  severity: "medium",
  status: "active",
  startDate: ""
};

const severityLabels: Record<DisasterSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical"
};

const statusLabels: Record<DisasterStatus, string> = {
  active: "Active",
  monitoring: "Monitoring",
  resolved: "Resolved"
};

export function DisasterManagement() {
  const [disasters, setDisasters] = useState<DisasterRecord[]>([]);

  const [formState, setFormState] = useState<CreateDisasterInput>(initialFormState);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [detailsId, setDetailsId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeCount = useMemo(
    () => disasters.filter((disaster) => disaster.status === "active").length,
    [disasters]
  );

  const criticalCount = useMemo(
    () => disasters.filter((disaster) => disaster.severity === "critical").length,
    [disasters]
  );

  async function refreshDisasters() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await listDisasters();
      setDisasters(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load disasters.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshDisasters();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (editingId) {
        const updated = await updateDisaster(editingId, formState);

        setDisasters((current) => current.map((item) => (item.id === editingId ? updated : item)));

        setEditingId(null);
      } else {
        const created = await createDisaster(formState);

        setDisasters((current) => [created, ...current]);
      }

      setFormState(initialFormState);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save disaster.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(disaster: DisasterRecord) {
    setEditingId(disaster.id);

    setFormState({
      title: disaster.title,
      disasterType: disaster.disasterType,
      location: disaster.location,
      description: disaster.description,
      severity: disaster.severity,
      status: disaster.status,
      startDate: disaster.startDate
    });

    window.scrollTo({
      top: 200,
      behavior: "smooth"
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormState(initialFormState);
  }

  function toggleDetails(id: string) {
    if (detailsId === id) {
      setDetailsId(null);
    } else {
      setDetailsId(id);
    }
  }

  async function handleStatusChange(disaster: DisasterRecord, status: DisasterStatus) {
    setErrorMessage(null);

    try {
      const updated = await updateDisaster(disaster.id, {
        status
      });

      setDisasters((current) => current.map((item) => (item.id === disaster.id ? updated : item)));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update disaster.");
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Are you sure you want to delete this disaster?");

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);

    try {
      await deleteDisaster(id);

      setDisasters((current) => current.filter((disaster) => disaster.id !== id));

      if (editingId === id) {
        cancelEdit();
      }

      if (detailsId === id) {
        setDetailsId(null);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete disaster.");
    }
  }

  return (
    <main className="app-shell">
      <section className="top-band">
        <div className="top-band__content">
          <div>
            <p className="eyebrow">Disaster Relief Coordination System</p>

            <h1>Disaster Information Management</h1>

            <p className="intro">
              Publish and maintain current disaster information so relief personnel and affected
              communities can access accurate emergency updates.
            </p>
          </div>

          <div className="status-strip" aria-label="Disaster summary">
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

      <RoleNavigation />

      <section className="workspace-grid" aria-label="Disaster management workspace">
        <form className="project-form" onSubmit={handleSubmit}>
          <div className="section-title">
            {editingId ? <Pencil size={18} /> : <Plus size={18} />}

            <h2>{editingId ? "Edit Disaster" : "Add Disaster"}</h2>
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
                  title: event.target.value
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
                  disasterType: event.target.value
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
                  location: event.target.value
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
                  description: event.target.value
                })
              }
              placeholder="Describe the disaster and affected areas."
            />
          </label>

          <label>
            Severity
            <select
              value={formState.severity}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  severity: event.target.value as DisasterSeverity
                })
              }
            >
              {DISASTER_SEVERITY_VALUES.map((severity) => (
                <option key={severity} value={severity}>
                  {severityLabels[severity]}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select
              value={formState.status}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  status: event.target.value as DisasterStatus
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
                  startDate: event.target.value
                })
              }
            />
          </label>

          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="spin" size={18} />
            ) : editingId ? (
              <Pencil size={18} />
            ) : (
              <Plus size={18} />
            )}

            {isSaving ? "Saving..." : editingId ? "Update disaster" : "Publish disaster"}
          </button>

          {editingId ? (
            <button
              className="icon-button"
              type="button"
              onClick={cancelEdit}
              style={{
                width: "100%"
              }}
            >
              <X size={18} />
              Cancel edit
            </button>
          ) : null}
        </form>

        <section className="project-list" aria-live="polite">
          <div className="list-header">
            <div className="section-title">
              <AlertTriangle size={18} />

              <h2>Current Disaster Records</h2>
            </div>

            <button className="icon-button" type="button" onClick={() => void refreshDisasters()}>
              <RefreshCw size={18} />
            </button>
          </div>

          {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

          {isLoading ? (
            <div className="loading-state">
              <Loader2 className="spin" size={24} />
              Loading disasters
            </div>
          ) : disasters.length === 0 ? (
            <div className="empty-state">
              <AlertTriangle size={32} />

              <h3>No disaster records</h3>

              <p>Add the first disaster record using the form.</p>
            </div>
          ) : (
            <div className="records">
              {disasters.map((disaster) => (
                <article className="record-card" key={disaster.id}>
                  <div className="record-card__main">
                    <div>
                      <h3>{disaster.title}</h3>

                      <p>{disaster.description}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px"
                      }}
                    >
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => toggleDetails(disaster.id)}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => handleEdit(disaster)}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        className="icon-button danger"
                        type="button"
                        onClick={() => void handleDelete(disaster.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="record-meta">
                    <span>{disaster.disasterType}</span>

                    <span>
                      <MapPin size={13} /> {disaster.location}
                    </span>

                    <span>Severity: {severityLabels[disaster.severity]}</span>

                    <span>Started: {new Date(disaster.startDate).toLocaleDateString()}</span>
                  </div>

                  {detailsId === disaster.id ? (
                    <div
                      style={{
                        borderTop: "1px solid #dbe4e7",
                        paddingTop: "14px",
                        marginTop: "14px"
                      }}
                    >
                      <p>
                        <strong>Type:</strong> {disaster.disasterType}
                      </p>

                      <p>
                        <strong>Location:</strong> {disaster.location}
                      </p>

                      <p>
                        <strong>Severity:</strong> {severityLabels[disaster.severity]}
                      </p>

                      <p>
                        <strong>Status:</strong> {statusLabels[disaster.status]}
                      </p>

                      <p>
                        <strong>Last updated:</strong>{" "}
                        {new Date(disaster.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  ) : null}

                  <div className="segmented-control">
                    {DISASTER_STATUS_VALUES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={disaster.status === status ? "selected" : ""}
                        onClick={() => void handleStatusChange(disaster, status)}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
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
