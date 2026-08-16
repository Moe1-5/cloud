import type {
  CreateDistributionInput,
  DistributionRecord,
  DistributionStatus,
  ReliefActivityRecord,
  ReliefActivitySummary,
  ResourceRecord
} from "@ddac/shared";
import {
  Activity,
  AlertTriangle,
  Ban,
  CheckCircle2,
  CircleOff,
  ClipboardPlus,
  Clock3,
  Loader2,
  MapPin,
  PackageCheck,
  RefreshCw,
  Route,
  Search,
  Send,
  Truck
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  createDistribution,
  getReliefActivities,
  listDistributions,
  updateDistributionStatus
} from "../../api/distributionsApi.js";
import { listResources } from "../../api/resourcesApi.js";

interface DistributionFormState {
  resourceId: string;
  quantity: number;
  destination: string;
  recipient: string;
  scheduledAt: string;
  notes: string;
}

const INITIAL_SUMMARY: ReliefActivitySummary = {
  activeDistributions: 0,
  deliveredDistributions: 0,
  resourcesNeedingAttention: 0
};

const STATUS_LABELS: Record<DistributionStatus, string> = {
  planned: "Planned",
  in_transit: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

type DistributionFilter = "all" | DistributionStatus;

function getDefaultScheduledAt(): string {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const offsetInMilliseconds = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetInMilliseconds).toISOString().slice(0, 16);
}

function getInitialForm(resourceId = ""): DistributionFormState {
  return {
    resourceId,
    quantity: 1,
    destination: "",
    recipient: "",
    scheduledAt: getDefaultScheduledAt(),
    notes: ""
  };
}

export function DistributionWorkspace() {
  const [distributions, setDistributions] = useState<DistributionRecord[]>([]);
  const [resources, setResources] = useState<ResourceRecord[]>([]);
  const [activities, setActivities] = useState<ReliefActivityRecord[]>([]);
  const [summary, setSummary] = useState<ReliefActivitySummary>(INITIAL_SUMMARY);
  const [formState, setFormState] = useState<DistributionFormState>(getInitialForm());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DistributionFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedResource = useMemo(
    () => resources.find((resource) => resource.id === formState.resourceId),
    [formState.resourceId, resources]
  );

  const filteredDistributions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return distributions.filter((distribution) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          distribution.resourceName,
          distribution.destination,
          distribution.recipient,
          distribution.origin
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesStatus = statusFilter === "all" || distribution.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [distributions, searchQuery, statusFilter]);

  function applySupportingData(
    nextResources: ResourceRecord[],
    activityResponse: { data: ReliefActivityRecord[]; summary: ReliefActivitySummary }
  ) {
    const availableResources = nextResources.filter((resource) => resource.quantity > 0);

    setResources(nextResources);
    setActivities(activityResponse.data);
    setSummary(activityResponse.summary);
    setFormState((currentForm) => ({
      ...currentForm,
      resourceId: availableResources.some((resource) => resource.id === currentForm.resourceId)
        ? currentForm.resourceId
        : (availableResources[0]?.id ?? "")
    }));
  }

  async function refreshWorkspace() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [nextDistributions, nextResources, activityResponse] = await Promise.all([
        listDistributions(),
        listResources(),
        getReliefActivities()
      ]);

      setDistributions(nextDistributions);
      applySupportingData(nextResources, activityResponse);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load distribution operations."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshSupportingData() {
    try {
      const [nextResources, activityResponse] = await Promise.all([
        listResources(),
        getReliefActivities()
      ]);

      applySupportingData(nextResources, activityResponse);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to refresh supporting distribution data."
      );
    }
  }

  useEffect(() => {
    void refreshWorkspace();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const input: CreateDistributionInput = {
        resourceId: formState.resourceId,
        quantity: formState.quantity,
        destination: formState.destination,
        recipient: formState.recipient,
        scheduledAt: new Date(formState.scheduledAt).toISOString(),
        notes: formState.notes.trim() || undefined
      };

      const createdDistribution = await createDistribution(input);

      setDistributions((currentDistributions) => [
        createdDistribution,
        ...currentDistributions.filter((distribution) => distribution.id !== createdDistribution.id)
      ]);
      setFormState(getInitialForm(formState.resourceId));
      setSuccessMessage(
        `Distribution to ${createdDistribution.destination} was reserved and scheduled.`
      );
      setIsSaving(false);
      void refreshSupportingData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to record the distribution."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(distribution: DistributionRecord, status: DistributionStatus) {
    setUpdatingId(distribution.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updatedDistribution = await updateDistributionStatus(distribution.id, status);

      setDistributions((currentDistributions) =>
        currentDistributions.map((currentDistribution) =>
          currentDistribution.id === updatedDistribution.id
            ? updatedDistribution
            : currentDistribution
        )
      );
      setSuccessMessage(
        `${updatedDistribution.resourceName} is now ${STATUS_LABELS[updatedDistribution.status].toLowerCase()}.`
      );
      setUpdatingId(null);
      void refreshSupportingData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update distribution status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section
      className="resource-workspace distribution-workspace"
      id="distributions"
      aria-label="Resource distribution and relief activity"
    >
      <div className="summary-grid" aria-label="Distribution operations summary">
        <article className="summary-card">
          <span className="summary-card__icon teal">
            <Truck size={21} aria-hidden="true" />
          </span>
          <div>
            <small>Active movements</small>
            <strong>{summary.activeDistributions}</strong>
          </div>
          <span className="summary-card__note">Planned or moving</span>
        </article>

        <article className="summary-card">
          <span className="summary-card__icon navy">
            <PackageCheck size={21} aria-hidden="true" />
          </span>
          <div>
            <small>Delivered</small>
            <strong>{summary.deliveredDistributions}</strong>
          </div>
          <span className="summary-card__note">Completed trips</span>
        </article>

        <article className="summary-card">
          <span className="summary-card__icon amber">
            <AlertTriangle size={21} aria-hidden="true" />
          </span>
          <div>
            <small>Inventory alerts</small>
            <strong>{summary.resourcesNeedingAttention}</strong>
          </div>
          <span className="summary-card__note">Restock required</span>
        </article>
      </div>

      <div className="workspace-grid">
        <form className="resource-form panel" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <span className="section-icon">
              <ClipboardPlus size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="panel-kicker">Supply movement</p>
              <h2>Record distribution</h2>
            </div>
          </div>

          <label>
            Relief resource
            <select
              required
              value={formState.resourceId}
              onChange={(event) => setFormState({ ...formState, resourceId: event.target.value })}
            >
              {resources
                .filter((resource) => resource.quantity > 0)
                .map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} - {resource.quantity} {resource.unit}
                  </option>
                ))}
            </select>
          </label>

          {selectedResource ? (
            <div className="availability-note">
              <MapPin size={15} aria-hidden="true" />
              <span>
                <strong>
                  {selectedResource.quantity} {selectedResource.unit}
                </strong>{" "}
                available at {selectedResource.location}
              </span>
            </div>
          ) : null}

          <label>
            Quantity to reserve
            <input
              required
              min={0.01}
              max={selectedResource?.quantity}
              step="any"
              type="number"
              value={formState.quantity}
              onChange={(event) =>
                setFormState({ ...formState, quantity: Number(event.target.value) })
              }
            />
          </label>

          <label>
            Destination
            <input
              required
              minLength={2}
              maxLength={200}
              value={formState.destination}
              onChange={(event) => setFormState({ ...formState, destination: event.target.value })}
              placeholder="Setia Alam Evacuation Centre"
            />
          </label>

          <label>
            Receiving team or contact
            <input
              required
              minLength={2}
              maxLength={160}
              value={formState.recipient}
              onChange={(event) => setFormState({ ...formState, recipient: event.target.value })}
              placeholder="Centre logistics team"
            />
          </label>

          <label>
            Scheduled dispatch
            <input
              required
              type="datetime-local"
              value={formState.scheduledAt}
              onChange={(event) => setFormState({ ...formState, scheduledAt: event.target.value })}
            />
          </label>

          <label>
            Dispatch notes
            <textarea
              maxLength={1000}
              value={formState.notes}
              onChange={(event) => setFormState({ ...formState, notes: event.target.value })}
              placeholder="Priority, access, or handover notes"
            />
          </label>

          <button className="primary-button" type="submit" disabled={isSaving || !selectedResource}>
            {isSaving ? (
              <Loader2 className="spin" size={18} aria-hidden="true" />
            ) : (
              <Send size={18} aria-hidden="true" />
            )}
            {isSaving ? "Reserving..." : "Reserve and schedule"}
          </button>
        </form>

        <div className="operations-stack">
          <section className="resource-list panel" aria-live="polite">
            <div className="list-header">
              <div>
                <p className="panel-kicker">Distribution register</p>
                <h2>Supply movements</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => {
                  setSuccessMessage(null);
                  void refreshWorkspace();
                }}
                aria-label="Refresh distribution operations"
              >
                <RefreshCw size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="filter-bar">
              <label className="search-field">
                <span className="sr-only">Search distributions</span>
                <Search size={17} aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search supply, recipient, or place"
                />
              </label>

              <label className="filter-field">
                <span className="sr-only">Filter distribution status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as DistributionFilter)}
                >
                  <option value="all">All movements</option>
                  <option value="planned">Planned</option>
                  <option value="in_transit">In transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
            </div>

            {errorMessage ? (
              <div className="error-banner" role="alert">
                <AlertTriangle size={18} aria-hidden="true" />
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="success-banner" role="status">
                <CheckCircle2 size={18} aria-hidden="true" />
                {successMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className="state-panel compact">
                <Loader2 className="spin" size={26} aria-hidden="true" />
                <strong>Loading distribution operations</strong>
              </div>
            ) : filteredDistributions.length === 0 ? (
              <div className="state-panel compact">
                <CircleOff size={30} aria-hidden="true" />
                <strong>No matching distributions</strong>
                <p>Adjust the filters or record a new supply movement.</p>
              </div>
            ) : (
              <div className="distribution-cards">
                {filteredDistributions.map((distribution) => (
                  <article className="distribution-card" key={distribution.id}>
                    <div className="distribution-card__header">
                      <div>
                        <span className={`status-badge ${distribution.status}`}>
                          {STATUS_LABELS[distribution.status]}
                        </span>
                        <h3>{distribution.resourceName}</h3>
                        <p>
                          {distribution.quantity} {distribution.unit} for {distribution.recipient}
                        </p>
                      </div>
                      <strong className="distribution-quantity">
                        {distribution.quantity.toLocaleString()}
                        <small>{distribution.unit}</small>
                      </strong>
                    </div>

                    <div className="distribution-route">
                      <span>
                        <MapPin size={15} aria-hidden="true" />
                        {distribution.origin}
                      </span>
                      <Route size={18} aria-hidden="true" />
                      <span>
                        <MapPin size={15} aria-hidden="true" />
                        {distribution.destination}
                      </span>
                    </div>

                    <div className="distribution-footer">
                      <span>
                        <Clock3 size={15} aria-hidden="true" />
                        {new Date(distribution.scheduledAt).toLocaleString("en-MY", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>

                      <div className="distribution-actions">
                        {distribution.status === "planned" ? (
                          <button
                            className="secondary-button"
                            type="button"
                            disabled={updatingId === distribution.id}
                            onClick={() => void handleStatusChange(distribution, "in_transit")}
                          >
                            <Truck size={15} aria-hidden="true" /> Dispatch
                          </button>
                        ) : null}
                        {distribution.status === "in_transit" ? (
                          <button
                            className="secondary-button success"
                            type="button"
                            disabled={updatingId === distribution.id}
                            onClick={() => void handleStatusChange(distribution, "delivered")}
                          >
                            <CheckCircle2 size={15} aria-hidden="true" /> Mark delivered
                          </button>
                        ) : null}
                        {distribution.status === "planned" ||
                        distribution.status === "in_transit" ? (
                          <button
                            className="text-button danger"
                            type="button"
                            disabled={updatingId === distribution.id}
                            onClick={() => void handleStatusChange(distribution, "cancelled")}
                          >
                            <Ban size={15} aria-hidden="true" /> Cancel
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <ReliefActivityPanel activities={activities} />
        </div>
      </div>
    </section>
  );
}

function ReliefActivityPanel({ activities }: { activities: ReliefActivityRecord[] }) {
  return (
    <section className="activity-panel panel" aria-label="Ongoing relief activity">
      <div className="list-header">
        <div>
          <p className="panel-kicker">Operational monitor</p>
          <h2>Ongoing relief activity</h2>
        </div>
        <Activity size={20} aria-hidden="true" />
      </div>

      <div className="activity-timeline">
        {activities.slice(0, 6).map((activity) => (
          <article className="activity-item" key={activity.id}>
            <span className={`activity-dot ${activity.status}`} aria-hidden="true" />
            <div>
              <div className="activity-item__title">
                <strong>{activity.title}</strong>
                <span className={`status-badge activity-${activity.status}`}>
                  {activity.status}
                </span>
              </div>
              <p>{activity.description}</p>
              <small>
                <MapPin size={13} aria-hidden="true" />
                {activity.location} ·{" "}
                {new Date(activity.occurredAt).toLocaleString("en-MY", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
