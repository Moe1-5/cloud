import type {
  CreateShelterInput,
  ShelterRecord,
  ShelterStatus,
} from "@ddac/shared";

import { SHELTER_STATUS_VALUES } from "@ddac/shared";

import {
  Eye,
  Home,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  X,
} from "lucide-react";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  createShelter,
  deleteShelter,
  listShelters,
  updateShelter,
} from "../../api/sheltersApi.js";

const initialForm: CreateShelterInput = {
  name: "",
  location: "",
  capacity: 100,
  currentOccupancy: 0,
  contactNumber: "",
  status: "open",
  notes: "",
};

const statusLabels: Record<ShelterStatus, string> = {
  open: "Open",
  full: "Full",
  closed: "Closed",
};

export function ShelterManagement() {
  const [shelters, setShelters] = useState<ShelterRecord[]>([]);
  const [form, setForm] =
    useState<CreateShelterInput>(initialForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [detailsId, setDetailsId] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const openShelters = useMemo(
    () =>
      shelters.filter(
        (shelter) => shelter.status === "open"
      ).length,
    [shelters]
  );

  const totalAvailableSpaces = useMemo(() => {
    return shelters.reduce((total, shelter) => {
      const available =
        shelter.capacity - shelter.currentOccupancy;

      return total + Math.max(available, 0);
    }, 0);
  }, [shelters]);

  async function refreshShelters() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await listShelters();
      setShelters(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load shelters."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshShelters();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (form.currentOccupancy > form.capacity) {
      setErrorMessage(
        "Current occupancy cannot be greater than shelter capacity."
      );
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (editingId) {
        const updatedShelter = await updateShelter(
          editingId,
          form
        );

        setShelters((current) =>
          current.map((shelter) =>
            shelter.id === editingId
              ? updatedShelter
              : shelter
          )
        );

        setEditingId(null);
      } else {
        const newShelter = await createShelter(form);

        setShelters((current) => [
          newShelter,
          ...current,
        ]);
      }

      setForm(initialForm);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save shelter."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(shelter: ShelterRecord) {
    setEditingId(shelter.id);

    setForm({
      name: shelter.name,
      location: shelter.location,
      capacity: shelter.capacity,
      currentOccupancy: shelter.currentOccupancy,
      contactNumber: shelter.contactNumber,
      status: shelter.status,
      notes: shelter.notes,
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

  function toggleDetails(id: string) {
    if (detailsId === id) {
      setDetailsId(null);
    } else {
      setDetailsId(id);
    }
  }

  async function handleStatusChange(
    shelter: ShelterRecord,
    status: ShelterStatus
  ) {
    setErrorMessage(null);

    try {
      const updated = await updateShelter(
        shelter.id,
        {
          status,
        }
      );

      setShelters((current) =>
        current.map((item) =>
          item.id === shelter.id ? updated : item
        )
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update shelter."
      );
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shelter?"
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);

    try {
      await deleteShelter(id);

      setShelters((current) =>
        current.filter(
          (shelter) => shelter.id !== id
        )
      );

      if (editingId === id) {
        cancelEdit();
      }

      if (detailsId === id) {
        setDetailsId(null);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete shelter."
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

            <h1>Evacuation Centre Management</h1>

            <p className="intro">
              Manage evacuation centres and shelters,
              including capacity, occupancy, availability
              and contact information.
            </p>
          </div>

          <div
            className="status-strip"
            aria-label="Shelter summary"
          >
            <div>
              <span>{openShelters}</span>
              <small>Open shelters</small>
            </div>

            <div>
              <span>{totalAvailableSpaces}</span>
              <small>Available spaces</small>
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
                ? "Edit Shelter"
                : "Add Shelter"}
            </h2>
          </div>

          <label>
            Shelter name
            <input
              required
              minLength={3}
              maxLength={150}
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
              placeholder="Shah Alam Community Hall"
            />
          </label>

          <label>
            Location
            <input
              required
              minLength={3}
              maxLength={250}
              value={form.location}
              onChange={(event) =>
                setForm({
                  ...form,
                  location: event.target.value,
                })
              }
              placeholder="Seksyen 7, Shah Alam"
            />
          </label>

          <label>
            Maximum capacity
            <input
              required
              type="number"
              min="1"
              value={form.capacity}
              onChange={(event) =>
                setForm({
                  ...form,
                  capacity: Number(
                    event.target.value
                  ),
                })
              }
            />
          </label>

          <label>
            Current occupancy
            <input
              required
              type="number"
              min="0"
              value={form.currentOccupancy}
              onChange={(event) =>
                setForm({
                  ...form,
                  currentOccupancy: Number(
                    event.target.value
                  ),
                })
              }
            />
          </label>

          <label>
            Contact number
            <input
              required
              minLength={7}
              maxLength={30}
              value={form.contactNumber}
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
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm({
                  ...form,
                  status:
                    event.target.value as ShelterStatus,
                })
              }
            >
              {SHELTER_STATUS_VALUES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {statusLabels[status]}
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            Notes
            <textarea
              maxLength={1000}
              value={form.notes}
              onChange={(event) =>
                setForm({
                  ...form,
                  notes: event.target.value,
                })
              }
              placeholder="Facilities, accessibility information or other notes."
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
              />
            ) : editingId ? (
              <Pencil size={18} />
            ) : (
              <Plus size={18} />
            )}

            {isSaving
              ? "Saving..."
              : editingId
                ? "Update shelter"
                : "Add shelter"}
          </button>

          {editingId ? (
            <button
              className="icon-button"
              type="button"
              onClick={cancelEdit}
              style={{ width: "100%" }}
            >
              <X size={18} />
              Cancel edit
            </button>
          ) : null}
        </form>

        <section
          className="project-list"
          aria-live="polite"
        >
          <div className="list-header">
            <div className="section-title">
              <Home size={18} />

              <h2>Evacuation Centres</h2>
            </div>

            <button
              className="icon-button"
              type="button"
              onClick={() =>
                void refreshShelters()
              }
              aria-label="Refresh shelters"
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

              Loading shelters
            </div>
          ) : shelters.length === 0 ? (
            <div className="empty-state">
              <Home size={32} />

              <h3>No shelters available</h3>

              <p>
                Add the first evacuation centre using
                the form.
              </p>
            </div>
          ) : (
            <div className="records">
              {shelters.map((shelter) => {
                const availableSpaces =
                  Math.max(
                    shelter.capacity -
                      shelter.currentOccupancy,
                    0
                  );

                return (
                  <article
                    className="record-card"
                    key={shelter.id}
                  >
                    <div className="record-card__main">
                      <div>
                        <h3>{shelter.name}</h3>

                        <p>
                          <MapPin
                            size={14}
                          />{" "}
                          {shelter.location}
                        </p>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          className="icon-button"
                          type="button"
                          onClick={() =>
                            toggleDetails(
                              shelter.id
                            )
                          }
                          aria-label={`View ${shelter.name}`}
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          className="icon-button"
                          type="button"
                          onClick={() =>
                            handleEdit(shelter)
                          }
                          aria-label={`Edit ${shelter.name}`}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          className="icon-button danger"
                          type="button"
                          onClick={() =>
                            void handleDelete(
                              shelter.id
                            )
                          }
                          aria-label={`Delete ${shelter.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="record-meta">
                      <span>
                        <Users size={13} />{" "}
                        {shelter.currentOccupancy}
                        /{shelter.capacity}
                      </span>

                      <span>
                        Available:{" "}
                        {availableSpaces}
                      </span>

                      <span>
                        {
                          statusLabels[
                            shelter.status
                          ]
                        }
                      </span>
                    </div>

                    {detailsId === shelter.id ? (
                      <div
                        style={{
                          borderTop:
                            "1px solid #dbe4e7",
                          paddingTop: "14px",
                          marginTop: "14px",
                        }}
                      >
                        <p>
                          <strong>
                            Contact:
                          </strong>{" "}
                          {shelter.contactNumber}
                        </p>

                        <p>
                          <strong>
                            Capacity:
                          </strong>{" "}
                          {shelter.capacity}
                        </p>

                        <p>
                          <strong>
                            Current occupancy:
                          </strong>{" "}
                          {
                            shelter.currentOccupancy
                          }
                        </p>

                        <p>
                          <strong>
                            Available:
                          </strong>{" "}
                          {availableSpaces}
                        </p>

                        <p>
                          <strong>
                            Notes:
                          </strong>{" "}
                          {shelter.notes ||
                            "No additional notes."}
                        </p>

                        <p>
                          <strong>
                            Last updated:
                          </strong>{" "}
                          {new Date(
                            shelter.updatedAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    ) : null}

                    <div
                      className="segmented-control"
                      aria-label={`Status for ${shelter.name}`}
                    >
                      {SHELTER_STATUS_VALUES.map(
                        (status) => (
                          <button
                            key={status}
                            type="button"
                            className={
                              shelter.status ===
                              status
                                ? "selected"
                                : ""
                            }
                            onClick={() =>
                              void handleStatusChange(
                                shelter,
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
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}