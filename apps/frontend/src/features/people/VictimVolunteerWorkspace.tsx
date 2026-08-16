import type {
  CreateVictimInput,
  CreateVolunteerInput,
  VictimRecord,
  VolunteerAvailability,
  VolunteerRecord
} from "@ddac/shared";
import { VOLUNTEER_AVAILABILITY_VALUES } from "@ddac/shared";
import { ClipboardPlus, HandHeart, Loader2, Search, UserPlus, Users } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  addAssistance,
  createVictim,
  createVolunteer,
  listVictims,
  listVolunteers,
  updateVictim,
  updateVolunteer
} from "../../api/reliefPeopleApi.js";
import { RoleNavigation } from "../../layouts/RoleNavigation.js";

const emptyVictim: CreateVictimInput = {
  fullName: "",
  identificationNumber: "",
  phoneNumber: "",
  location: "",
  assistanceNeeds: "",
  status: "registered"
};

const emptyVolunteer: CreateVolunteerInput = {
  fullName: "",
  phoneNumber: "",
  skills: "",
  availability: "available"
};

const availabilityLabels: Record<VolunteerAvailability, string> = {
  available: "Available",
  assigned: "Assigned",
  unavailable: "Unavailable"
};

export function VictimVolunteerWorkspace() {
  const [view, setView] = useState<"victims" | "volunteers">("victims");
  const [victims, setVictims] = useState<VictimRecord[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>([]);
  const [victimForm, setVictimForm] = useState(emptyVictim);
  const [volunteerForm, setVolunteerForm] = useState(emptyVolunteer);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const availableCount = useMemo(
    () => volunteers.filter((item) => item.availability === "available").length,
    [volunteers]
  );

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const [nextVictims, nextVolunteers] = await Promise.all([listVictims(), listVolunteers()]);
      setVictims(nextVictims);
      setVolunteers(nextVolunteers);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load relief records.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function submitVictim(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const created = await createVictim(victimForm);
      setVictims((current) => [created, ...current]);
      setVictimForm(emptyVictim);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to register victim.");
    } finally {
      setIsSaving(false);
    }
  }

  async function submitVolunteer(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const created = await createVolunteer(volunteerForm);
      setVolunteers((current) => [created, ...current]);
      setVolunteerForm(emptyVolunteer);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to register volunteer.");
    } finally {
      setIsSaving(false);
    }
  }

  async function searchVictims(event: FormEvent) {
    event.preventDefault();
    try {
      setVictims(await listVictims(search));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to search victims.");
    }
  }

  async function editNeeds(victim: VictimRecord) {
    const assistanceNeeds = window.prompt("Update assistance needs", victim.assistanceNeeds);
    if (!assistanceNeeds || assistanceNeeds === victim.assistanceNeeds) return;
    try {
      const updated = await updateVictim(victim.id, { assistanceNeeds });
      setVictims((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update victim.");
    }
  }

  async function recordAssistance(victim: VictimRecord) {
    const description = window.prompt("Describe the assistance provided");
    const providedBy = description ? window.prompt("Relief officer name") : null;
    if (!description || !providedBy) return;
    try {
      const updated = await addAssistance(victim.id, { description, providedBy });
      setVictims((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to record assistance.");
    }
  }

  async function changeAvailability(
    volunteer: VolunteerRecord,
    availability: VolunteerAvailability
  ) {
    try {
      const updated = await updateVolunteer(volunteer.id, { availability });
      setVolunteers((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update availability.");
    }
  }

  async function assignTask(volunteer: VolunteerRecord) {
    const assignedTask = window.prompt("Relief task", volunteer.assignedTask);
    const taskLocation = assignedTask
      ? window.prompt("Task location", volunteer.taskLocation)
      : null;
    if (!assignedTask || !taskLocation) return;
    try {
      const updated = await updateVolunteer(volunteer.id, {
        assignedTask,
        taskLocation,
        availability: "assigned"
      });
      setVolunteers((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to assign task.");
    }
  }

  return (
    <main className="app-shell">
      <section className="top-band">
        <div className="top-band__content">
          <div>
            <p className="eyebrow">Relief coordination</p>
            <h1>Victim and volunteer management</h1>
            <p className="intro">
              Track assistance needs and coordinate available relief volunteers.
            </p>
          </div>
          <div className="status-strip">
            <div>
              <span>{victims.length}</span>
              <small>Victim records</small>
            </div>
            <div>
              <span>{availableCount}</span>
              <small>Available volunteers</small>
            </div>
          </div>
        </div>
      </section>

      <RoleNavigation />

      <nav className="module-tabs" aria-label="People coordination modules">
        <button
          className={view === "victims" ? "selected" : ""}
          type="button"
          onClick={() => setView("victims")}
        >
          <HandHeart size={18} />
          Victims
        </button>
        <button
          className={view === "volunteers" ? "selected" : ""}
          type="button"
          onClick={() => setView("volunteers")}
        >
          <Users size={18} />
          Volunteers
        </button>
      </nav>

      {error ? <div className="page-error">{error}</div> : null}

      {view === "victims" ? (
        <section className="workspace-grid">
          <form className="project-form" onSubmit={submitVictim}>
            <div className="section-title">
              <UserPlus size={18} />
              <h2>Register victim</h2>
            </div>
            <label>
              Full name
              <input
                required
                minLength={2}
                value={victimForm.fullName}
                onChange={(event) => setVictimForm({ ...victimForm, fullName: event.target.value })}
              />
            </label>
            <label>
              Identification number
              <input
                required
                minLength={4}
                value={victimForm.identificationNumber}
                onChange={(event) =>
                  setVictimForm({ ...victimForm, identificationNumber: event.target.value })
                }
              />
            </label>
            <label>
              Phone number
              <input
                required
                minLength={7}
                value={victimForm.phoneNumber}
                onChange={(event) =>
                  setVictimForm({ ...victimForm, phoneNumber: event.target.value })
                }
              />
            </label>
            <label>
              Current location
              <input
                required
                minLength={2}
                value={victimForm.location}
                onChange={(event) => setVictimForm({ ...victimForm, location: event.target.value })}
              />
            </label>
            <label>
              Assistance needs
              <textarea
                required
                minLength={3}
                value={victimForm.assistanceNeeds}
                onChange={(event) =>
                  setVictimForm({ ...victimForm, assistanceNeeds: event.target.value })
                }
              />
            </label>
            <button className="primary-button" disabled={isSaving}>
              {isSaving ? <Loader2 className="spin" size={18} /> : <UserPlus size={18} />}Register
              victim
            </button>
          </form>
          <section className="project-list">
            <form className="search-bar" onSubmit={searchVictims}>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, ID or phone"
              />
              <button className="primary-button">
                <Search size={17} />
                Search
              </button>
            </form>
            {isLoading ? (
              <div className="loading-state">
                <Loader2 className="spin" />
                Loading victims
              </div>
            ) : (
              <div className="records">
                {victims.map((victim) => (
                  <article className="record-card" key={victim.id}>
                    <div className="record-card__main">
                      <div>
                        <h3>{victim.fullName}</h3>
                        <p>{victim.assistanceNeeds}</p>
                      </div>
                      <span className="badge">{victim.status.replace("_", " ")}</span>
                    </div>
                    <div className="record-meta">
                      <span>{victim.identificationNumber}</span>
                      <span>{victim.phoneNumber}</span>
                      <span>{victim.location}</span>
                    </div>
                    <div className="card-actions">
                      <button type="button" onClick={() => void editNeeds(victim)}>
                        Update needs
                      </button>
                      <button type="button" onClick={() => void recordAssistance(victim)}>
                        <ClipboardPlus size={15} />
                        Record assistance
                      </button>
                    </div>
                    {victim.assistanceHistory.length ? (
                      <details>
                        <summary>Assistance history ({victim.assistanceHistory.length})</summary>
                        {victim.assistanceHistory.map((entry) => (
                          <p className="history-entry" key={entry.id}>
                            {entry.description} — {entry.providedBy},{" "}
                            {new Date(entry.providedAt).toLocaleDateString()}
                          </p>
                        ))}
                      </details>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      ) : (
        <section className="workspace-grid">
          <form className="project-form" onSubmit={submitVolunteer}>
            <div className="section-title">
              <UserPlus size={18} />
              <h2>Register volunteer</h2>
            </div>
            <label>
              Full name
              <input
                required
                minLength={2}
                value={volunteerForm.fullName}
                onChange={(event) =>
                  setVolunteerForm({ ...volunteerForm, fullName: event.target.value })
                }
              />
            </label>
            <label>
              Phone number
              <input
                required
                minLength={7}
                value={volunteerForm.phoneNumber}
                onChange={(event) =>
                  setVolunteerForm({ ...volunteerForm, phoneNumber: event.target.value })
                }
              />
            </label>
            <label>
              Skills
              <textarea
                required
                minLength={2}
                value={volunteerForm.skills}
                onChange={(event) =>
                  setVolunteerForm({ ...volunteerForm, skills: event.target.value })
                }
              />
            </label>
            <button className="primary-button" disabled={isSaving}>
              {isSaving ? <Loader2 className="spin" size={18} /> : <UserPlus size={18} />}Register
              volunteer
            </button>
          </form>
          <section className="project-list">
            <div className="section-title">
              <Users size={18} />
              <h2>Volunteer roster</h2>
            </div>
            {isLoading ? (
              <div className="loading-state">
                <Loader2 className="spin" />
                Loading volunteers
              </div>
            ) : (
              <div className="records">
                {volunteers.map((volunteer) => (
                  <article className="record-card" key={volunteer.id}>
                    <div className="record-card__main">
                      <div>
                        <h3>{volunteer.fullName}</h3>
                        <p>{volunteer.skills}</p>
                      </div>
                      <span className="badge">{availabilityLabels[volunteer.availability]}</span>
                    </div>
                    <div className="record-meta">
                      <span>{volunteer.phoneNumber}</span>
                      {volunteer.assignedTask ? (
                        <span>
                          {volunteer.assignedTask} at {volunteer.taskLocation}
                        </span>
                      ) : null}
                    </div>
                    <div className="segmented-control">
                      {VOLUNTEER_AVAILABILITY_VALUES.map((value) => (
                        <button
                          className={volunteer.availability === value ? "selected" : ""}
                          type="button"
                          onClick={() => void changeAvailability(volunteer, value)}
                          key={value}
                        >
                          {availabilityLabels[value]}
                        </button>
                      ))}
                    </div>
                    <div className="card-actions">
                      <button type="button" onClick={() => void assignTask(volunteer)}>
                        Assign relief task
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      )}
    </main>
  );
}
