import type {
  AffectedUserProfileRecord,
  AssistanceType,
  CoordinatorEmergencyUpdateInput,
  CreateAffectedUserProfileInput,
  EmergencyPriority,
  EmergencyRequestRecord,
  EmergencyRequestStatus
} from "@ddac/shared";
import { ASSISTANCE_TYPE_VALUES, EMERGENCY_PRIORITY_VALUES } from "@ddac/shared";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  CircleOff,
  ClipboardCheck,
  ClipboardPen,
  Clock3,
  Edit3,
  Loader2,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Siren,
  UserCheck,
  UserRound,
  UsersRound,
  X
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  cancelEmergencyRequest,
  createAffectedUserProfile,
  createEmergencyRequest,
  listAffectedUserProfiles,
  listEmergencyRequests,
  updateAffectedUserProfile,
  updateEmergencyRequest,
  updateEmergencyRequestByCoordinator
} from "../../api/emergencyRequestsApi.js";
import {
  AffectedUserPageHero,
  CoordinatorPageHero,
  RoleNavigation
} from "../../layouts/RoleNavigation.js";

type EmergencyPerspective = "affected_user" | "coordinator";
type RequestFilter = "all" | EmergencyRequestStatus;

type ProfileFormState = CreateAffectedUserProfileInput;

interface RequestFormState {
  assistanceType: AssistanceType;
  description: string;
  location: string;
  peopleAffected: number;
}

const ASSISTANCE_LABELS: Record<AssistanceType, string> = {
  evacuation: "Evacuation",
  medical: "Medical assistance",
  food_water: "Food and water",
  shelter: "Emergency shelter",
  rescue: "Rescue",
  other: "Other assistance"
};

const PRIORITY_LABELS: Record<EmergencyPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical"
};

const STATUS_LABELS: Record<EmergencyRequestStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  assigned: "Assigned",
  in_progress: "In progress",
  resolved: "Resolved",
  cancelled: "Cancelled"
};

const EMPTY_PROFILE: ProfileFormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  householdSize: 1,
  emergencyContact: ""
};

function getEmptyRequest(location = ""): RequestFormState {
  return {
    assistanceType: "evacuation",
    description: "",
    location,
    peopleAffected: 1
  };
}

function toProfileForm(profile: AffectedUserProfileRecord): ProfileFormState {
  return {
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    householdSize: profile.householdSize,
    emergencyContact: profile.emergencyContact
  };
}

export function EmergencyWorkspace() {
  const [perspective, setPerspective] = useState<EmergencyPerspective>("affected_user");
  const [profiles, setProfiles] = useState<AffectedUserProfileRecord[]>([]);
  const [requests, setRequests] = useState<EmergencyRequestRecord[]>([]);
  const [activeProfileId, setActiveProfileId] = useState("");
  const [profileForm, setProfileForm] = useState<ProfileFormState>(EMPTY_PROFILE);
  const [isRegisteringProfile, setIsRegisteringProfile] = useState(false);
  const [requestForm, setRequestForm] = useState<RequestFormState>(getEmptyRequest());
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [requestFilter, setRequestFilter] = useState<RequestFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [assignmentByRequest, setAssignmentByRequest] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingRequest, setIsSavingRequest] = useState(false);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeProfile = useMemo(
    () => profiles.find((profile) => profile.id === activeProfileId),
    [activeProfileId, profiles]
  );

  const activeProfileRequests = useMemo(
    () => requests.filter((request) => request.requesterId === activeProfileId),
    [activeProfileId, requests]
  );

  const coordinatorRequests = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus = requestFilter === "all" || request.status === requestFilter;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [request.requesterName, request.location, ASSISTANCE_LABELS[request.assistanceType]].some(
          (value) => value.toLowerCase().includes(normalizedQuery)
        );
      return matchesStatus && matchesSearch;
    });
  }, [requestFilter, requests, searchQuery]);

  const affectedSummary = useMemo(
    () => ({
      awaiting: activeProfileRequests.filter(
        (request) => request.status === "submitted" || request.status === "under_review"
      ).length,
      active: activeProfileRequests.filter(
        (request) => request.status === "assigned" || request.status === "in_progress"
      ).length,
      resolved: activeProfileRequests.filter((request) => request.status === "resolved").length
    }),
    [activeProfileRequests]
  );

  const coordinatorSummary = useMemo(
    () => ({
      critical: requests.filter(
        (request) =>
          request.priority === "critical" &&
          request.status !== "resolved" &&
          request.status !== "cancelled"
      ).length,
      unassigned: requests.filter(
        (request) =>
          (request.status === "submitted" || request.status === "under_review") &&
          !request.assignedTo
      ).length,
      active: requests.filter(
        (request) => request.status === "assigned" || request.status === "in_progress"
      ).length
    }),
    [requests]
  );

  async function refreshEmergencyWorkspace(preferredProfileId?: string) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [nextProfiles, nextRequests] = await Promise.all([
        listAffectedUserProfiles(),
        listEmergencyRequests()
      ]);
      const nextProfileId =
        preferredProfileId && nextProfiles.some((profile) => profile.id === preferredProfileId)
          ? preferredProfileId
          : activeProfileId && nextProfiles.some((profile) => profile.id === activeProfileId)
            ? activeProfileId
            : (nextProfiles[0]?.id ?? "");
      const nextProfile = nextProfiles.find((profile) => profile.id === nextProfileId);

      setProfiles(nextProfiles);
      setRequests(nextRequests);
      setActiveProfileId(nextProfileId);
      setAssignmentByRequest(
        Object.fromEntries(nextRequests.map((request) => [request.id, request.assignedTo ?? ""]))
      );

      if (nextProfile && !isRegisteringProfile) {
        setProfileForm(toProfileForm(nextProfile));
        setRequestForm((currentForm) => ({
          ...currentForm,
          location: currentForm.location || nextProfile.address
        }));
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load emergency assistance."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshEmergencyWorkspace();
  }, []);

  function handleProfileSelection(profileId: string) {
    const profile = profiles.find((item) => item.id === profileId);
    setActiveProfileId(profileId);
    setIsRegisteringProfile(false);
    setEditingRequestId(null);

    if (profile) {
      setProfileForm(toProfileForm(profile));
      setRequestForm(getEmptyRequest(profile.address));
    }
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProfile(true);
    setErrorMessage(null);

    try {
      if (isRegisteringProfile) {
        const createdProfile = await createAffectedUserProfile(profileForm);
        setIsRegisteringProfile(false);
        await refreshEmergencyWorkspace(createdProfile.id);
      } else if (activeProfile) {
        const updatedProfile = await updateAffectedUserProfile(activeProfile.id, profileForm);
        setProfiles((currentProfiles) =>
          currentProfiles.map((profile) =>
            profile.id === updatedProfile.id ? updatedProfile : profile
          )
        );
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save the profile.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeProfile) {
      setErrorMessage("Register or select an affected-user profile first.");
      return;
    }

    setIsSavingRequest(true);
    setErrorMessage(null);

    try {
      if (editingRequestId) {
        await updateEmergencyRequest(editingRequestId, {
          requesterId: activeProfile.id,
          ...requestForm
        });
      } else {
        await createEmergencyRequest({ requesterId: activeProfile.id, ...requestForm });
      }

      setEditingRequestId(null);
      setRequestForm(getEmptyRequest(activeProfile.address));
      await refreshEmergencyWorkspace(activeProfile.id);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save the emergency request."
      );
    } finally {
      setIsSavingRequest(false);
    }
  }

  function handleEditRequest(request: EmergencyRequestRecord) {
    setEditingRequestId(request.id);
    setRequestForm({
      assistanceType: request.assistanceType,
      description: request.description,
      location: request.location,
      peopleAffected: request.peopleAffected
    });
    document.querySelector("#emergency-request-form")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleCancelRequest(request: EmergencyRequestRecord) {
    if (!activeProfile) {
      return;
    }

    const confirmed = window.confirm("Cancel this emergency assistance request?");
    if (!confirmed) {
      return;
    }

    setUpdatingRequestId(request.id);
    setErrorMessage(null);

    try {
      await cancelEmergencyRequest(request.id, activeProfile.id);
      await refreshEmergencyWorkspace(activeProfile.id);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to cancel the request.");
    } finally {
      setUpdatingRequestId(null);
    }
  }

  async function handleCoordinatorUpdate(
    request: EmergencyRequestRecord,
    input: CoordinatorEmergencyUpdateInput
  ) {
    setUpdatingRequestId(request.id);
    setErrorMessage(null);

    try {
      await updateEmergencyRequestByCoordinator(request.id, input);
      await refreshEmergencyWorkspace(activeProfileId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update the emergency case."
      );
    } finally {
      setUpdatingRequestId(null);
    }
  }

  return (
    <>
      <AffectedUserPageHero
        title="Your relief assistance"
        description="Manage your community profile, request urgent support, and follow the progress of your assistance cases."
      />
      <CoordinatorPageHero
        title="Emergency assistance cases"
        description="Review requests, coordinate urgent support, and monitor response progress."
      />
      <RoleNavigation />
      <section
        className="resource-workspace emergency-workspace"
        id="emergency-requests"
        aria-label="Emergency assistance requests"
      >
        <div className="workspace-perspective" aria-label="Emergency request perspective">
          <button
            className={perspective === "affected_user" ? "selected" : ""}
            type="button"
            onClick={() => setPerspective("affected_user")}
          >
            <UserRound size={17} aria-hidden="true" /> Affected user
          </button>
          <button
            className={perspective === "coordinator" ? "selected" : ""}
            type="button"
            onClick={() => setPerspective("coordinator")}
          >
            <ShieldCheck size={17} aria-hidden="true" /> Relief coordinator
          </button>
        </div>

        {errorMessage ? (
          <div className="error-banner workspace-error" role="alert">
            <AlertTriangle size={18} aria-hidden="true" />
            {errorMessage}
          </div>
        ) : null}

        {perspective === "affected_user" ? (
          <AffectedUserView
            profiles={profiles}
            activeProfile={activeProfile}
            activeProfileId={activeProfileId}
            requests={activeProfileRequests}
            profileForm={profileForm}
            requestForm={requestForm}
            editingRequestId={editingRequestId}
            isRegisteringProfile={isRegisteringProfile}
            isLoading={isLoading}
            isSavingProfile={isSavingProfile}
            isSavingRequest={isSavingRequest}
            updatingRequestId={updatingRequestId}
            summary={affectedSummary}
            onProfileSelection={handleProfileSelection}
            onProfileFormChange={setProfileForm}
            onProfileSubmit={handleProfileSubmit}
            onRegisterProfile={() => {
              setIsRegisteringProfile(true);
              setProfileForm(EMPTY_PROFILE);
            }}
            onCancelProfileRegistration={() => {
              setIsRegisteringProfile(false);
              if (activeProfile) setProfileForm(toProfileForm(activeProfile));
            }}
            onRequestFormChange={setRequestForm}
            onRequestSubmit={handleRequestSubmit}
            onEditRequest={handleEditRequest}
            onCancelRequest={handleCancelRequest}
            onCancelRequestEdit={() => {
              setEditingRequestId(null);
              setRequestForm(getEmptyRequest(activeProfile?.address));
            }}
            onRefresh={() => void refreshEmergencyWorkspace(activeProfileId)}
          />
        ) : (
          <CoordinatorView
            requests={coordinatorRequests}
            summary={coordinatorSummary}
            isLoading={isLoading}
            updatingRequestId={updatingRequestId}
            requestFilter={requestFilter}
            searchQuery={searchQuery}
            assignmentByRequest={assignmentByRequest}
            onRequestFilter={setRequestFilter}
            onSearchQuery={setSearchQuery}
            onAssignmentChange={(requestId, value) =>
              setAssignmentByRequest((currentAssignments) => ({
                ...currentAssignments,
                [requestId]: value
              }))
            }
            onUpdate={handleCoordinatorUpdate}
            onRefresh={() => void refreshEmergencyWorkspace(activeProfileId)}
          />
        )}
      </section>
    </>
  );
}

interface AffectedUserViewProps {
  profiles: AffectedUserProfileRecord[];
  activeProfile: AffectedUserProfileRecord | undefined;
  activeProfileId: string;
  requests: EmergencyRequestRecord[];
  profileForm: ProfileFormState;
  requestForm: RequestFormState;
  editingRequestId: string | null;
  isRegisteringProfile: boolean;
  isLoading: boolean;
  isSavingProfile: boolean;
  isSavingRequest: boolean;
  updatingRequestId: string | null;
  summary: { awaiting: number; active: number; resolved: number };
  onProfileSelection: (profileId: string) => void;
  onProfileFormChange: (value: ProfileFormState) => void;
  onProfileSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRegisterProfile: () => void;
  onCancelProfileRegistration: () => void;
  onRequestFormChange: (value: RequestFormState) => void;
  onRequestSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEditRequest: (request: EmergencyRequestRecord) => void;
  onCancelRequest: (request: EmergencyRequestRecord) => void;
  onCancelRequestEdit: () => void;
  onRefresh: () => void;
}

function AffectedUserView(props: AffectedUserViewProps) {
  return (
    <>
      <div className="summary-grid">
        <SummaryCard
          icon={Clock3}
          tone="amber"
          label="Awaiting response"
          value={props.summary.awaiting}
          note="Submitted or reviewed"
        />
        <SummaryCard
          icon={UserCheck}
          tone="teal"
          label="Help in progress"
          value={props.summary.active}
          note="Assigned or active"
        />
        <SummaryCard
          icon={CheckCircle2}
          tone="navy"
          label="Resolved requests"
          value={props.summary.resolved}
          note="Completed assistance"
        />
      </div>

      <div className="emergency-layout">
        <div className="operations-stack">
          <form className="profile-form panel" onSubmit={props.onProfileSubmit}>
            <div className="panel-heading">
              <span className="section-icon">
                <UserRound size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="panel-kicker">Community account</p>
                <h2>{props.isRegisteringProfile ? "Register profile" : "Manage profile"}</h2>
              </div>
              {props.isRegisteringProfile ? (
                <button
                  className="icon-button"
                  type="button"
                  onClick={props.onCancelProfileRegistration}
                  aria-label="Cancel profile registration"
                >
                  <X size={17} aria-hidden="true" />
                </button>
              ) : (
                <button
                  className="icon-button"
                  type="button"
                  onClick={props.onRegisterProfile}
                  aria-label="Register another affected user"
                >
                  <Plus size={17} aria-hidden="true" />
                </button>
              )}
            </div>

            {!props.isRegisteringProfile ? (
              <label>
                Active community profile
                <select
                  value={props.activeProfileId}
                  onChange={(event) => props.onProfileSelection(event.target.value)}
                >
                  {props.profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.fullName}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label>
              Full name
              <input
                required
                minLength={2}
                maxLength={160}
                value={props.profileForm.fullName}
                onChange={(event) =>
                  props.onProfileFormChange({ ...props.profileForm, fullName: event.target.value })
                }
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                maxLength={254}
                value={props.profileForm.email}
                onChange={(event) =>
                  props.onProfileFormChange({ ...props.profileForm, email: event.target.value })
                }
              />
            </label>
            <div className="form-row">
              <label>
                Phone
                <input
                  required
                  minLength={7}
                  maxLength={30}
                  value={props.profileForm.phone}
                  onChange={(event) =>
                    props.onProfileFormChange({ ...props.profileForm, phone: event.target.value })
                  }
                />
              </label>
              <label>
                Household size
                <input
                  required
                  min={1}
                  max={100}
                  type="number"
                  value={props.profileForm.householdSize}
                  onChange={(event) =>
                    props.onProfileFormChange({
                      ...props.profileForm,
                      householdSize: Number(event.target.value)
                    })
                  }
                />
              </label>
            </div>
            <label>
              Home address
              <input
                required
                minLength={5}
                maxLength={300}
                value={props.profileForm.address}
                onChange={(event) =>
                  props.onProfileFormChange({ ...props.profileForm, address: event.target.value })
                }
              />
            </label>
            <label>
              Emergency contact
              <input
                required
                minLength={7}
                maxLength={160}
                value={props.profileForm.emergencyContact}
                onChange={(event) =>
                  props.onProfileFormChange({
                    ...props.profileForm,
                    emergencyContact: event.target.value
                  })
                }
                placeholder="Name and phone number"
              />
            </label>
            <button className="primary-button" type="submit" disabled={props.isSavingProfile}>
              {props.isSavingProfile ? (
                <Loader2 className="spin" size={18} aria-hidden="true" />
              ) : (
                <CheckCircle2 size={18} aria-hidden="true" />
              )}
              {props.isSavingProfile
                ? "Saving..."
                : props.isRegisteringProfile
                  ? "Register profile"
                  : "Save profile"}
            </button>
          </form>

          <form
            className="resource-form panel"
            id="emergency-request-form"
            onSubmit={props.onRequestSubmit}
          >
            <div className="panel-heading">
              <span className="section-icon">
                <Siren size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="panel-kicker">Emergency assistance</p>
                <h2>{props.editingRequestId ? "Update request" : "Request help"}</h2>
              </div>
              {props.editingRequestId ? (
                <button
                  className="icon-button"
                  type="button"
                  onClick={props.onCancelRequestEdit}
                  aria-label="Cancel request editing"
                >
                  <X size={17} aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <label>
              Assistance needed
              <select
                value={props.requestForm.assistanceType}
                onChange={(event) =>
                  props.onRequestFormChange({
                    ...props.requestForm,
                    assistanceType: event.target.value as AssistanceType
                  })
                }
              >
                {ASSISTANCE_TYPE_VALUES.map((type) => (
                  <option key={type} value={type}>
                    {ASSISTANCE_LABELS[type]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              What assistance is required?
              <textarea
                required
                minLength={10}
                maxLength={1500}
                value={props.requestForm.description}
                onChange={(event) =>
                  props.onRequestFormChange({
                    ...props.requestForm,
                    description: event.target.value
                  })
                }
                placeholder="Describe the situation, immediate risks, and what your household needs."
              />
            </label>
            <label>
              Current location
              <input
                required
                minLength={3}
                maxLength={300}
                value={props.requestForm.location}
                onChange={(event) =>
                  props.onRequestFormChange({ ...props.requestForm, location: event.target.value })
                }
              />
            </label>
            <label>
              People affected
              <input
                required
                min={1}
                max={1000}
                type="number"
                value={props.requestForm.peopleAffected}
                onChange={(event) =>
                  props.onRequestFormChange({
                    ...props.requestForm,
                    peopleAffected: Number(event.target.value)
                  })
                }
              />
            </label>
            <button
              className="primary-button emergency-button"
              type="submit"
              disabled={props.isSavingRequest || !props.activeProfile}
            >
              {props.isSavingRequest ? (
                <Loader2 className="spin" size={18} aria-hidden="true" />
              ) : (
                <Siren size={18} aria-hidden="true" />
              )}
              {props.isSavingRequest
                ? "Submitting..."
                : props.editingRequestId
                  ? "Save request changes"
                  : "Submit assistance request"}
            </button>
          </form>
        </div>

        <section className="request-list panel" aria-live="polite">
          <div className="list-header">
            <div>
              <p className="panel-kicker">My assistance</p>
              <h2>Request status</h2>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={props.onRefresh}
              aria-label="Refresh request status"
            >
              <RefreshCw size={18} aria-hidden="true" />
            </button>
          </div>
          {props.activeProfile ? (
            <div className="profile-summary">
              <div className="profile-avatar">{props.activeProfile.fullName.charAt(0)}</div>
              <div>
                <strong>{props.activeProfile.fullName}</strong>
                <span>
                  <Phone size={13} aria-hidden="true" /> {props.activeProfile.phone}
                </span>
              </div>
            </div>
          ) : null}
          {props.isLoading ? (
            <LoadingState label="Loading emergency requests" />
          ) : props.requests.length === 0 ? (
            <EmptyState
              label="No emergency requests"
              text="Submit a request when your household needs assistance."
            />
          ) : (
            <div className="request-cards">
              {props.requests.map((request) => (
                <AffectedRequestCard
                  key={request.id}
                  request={request}
                  isUpdating={props.updatingRequestId === request.id}
                  onEdit={props.onEditRequest}
                  onCancel={props.onCancelRequest}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

interface CoordinatorViewProps {
  requests: EmergencyRequestRecord[];
  summary: { critical: number; unassigned: number; active: number };
  isLoading: boolean;
  updatingRequestId: string | null;
  requestFilter: RequestFilter;
  searchQuery: string;
  assignmentByRequest: Record<string, string>;
  onRequestFilter: (value: RequestFilter) => void;
  onSearchQuery: (value: string) => void;
  onAssignmentChange: (requestId: string, value: string) => void;
  onUpdate: (request: EmergencyRequestRecord, input: CoordinatorEmergencyUpdateInput) => void;
  onRefresh: () => void;
}

function CoordinatorView(props: CoordinatorViewProps) {
  return (
    <>
      <div className="summary-grid">
        <SummaryCard
          icon={Siren}
          tone="amber"
          label="Critical cases"
          value={props.summary.critical}
          note="Immediate attention"
        />
        <SummaryCard
          icon={UsersRound}
          tone="navy"
          label="Unassigned"
          value={props.summary.unassigned}
          note="Awaiting ownership"
        />
        <SummaryCard
          icon={ClipboardCheck}
          tone="teal"
          label="Active cases"
          value={props.summary.active}
          note="Assigned or responding"
        />
      </div>
      <section className="coordinator-queue panel" aria-live="polite">
        <div className="list-header">
          <div>
            <p className="panel-kicker">Coordinator case queue</p>
            <h2>Emergency assistance requests</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={props.onRefresh}
            aria-label="Refresh emergency cases"
          >
            <RefreshCw size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="filter-bar">
          <label className="search-field">
            <span className="sr-only">Search emergency cases</span>
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={props.searchQuery}
              onChange={(event) => props.onSearchQuery(event.target.value)}
              placeholder="Search requester, need, or location"
            />
          </label>
          <label className="filter-field">
            <span className="sr-only">Filter case status</span>
            <select
              value={props.requestFilter}
              onChange={(event) => props.onRequestFilter(event.target.value as RequestFilter)}
            >
              <option value="all">All case statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under review</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>
        {props.isLoading ? (
          <LoadingState label="Loading coordinator case queue" />
        ) : props.requests.length === 0 ? (
          <EmptyState
            label="No matching emergency cases"
            text="Adjust the search or status filter."
          />
        ) : (
          <div className="coordinator-case-grid">
            {props.requests.map((request) => (
              <CoordinatorRequestCard
                key={request.id}
                request={request}
                assignment={props.assignmentByRequest[request.id] ?? ""}
                isUpdating={props.updatingRequestId === request.id}
                onAssignmentChange={props.onAssignmentChange}
                onUpdate={props.onUpdate}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function SummaryCard({
  icon: Icon,
  tone,
  label,
  value,
  note
}: {
  icon: typeof Clock3;
  tone: "teal" | "amber" | "navy";
  label: string;
  value: number;
  note: string;
}) {
  return (
    <article className="summary-card">
      <span className={`summary-card__icon ${tone}`}>
        <Icon size={21} aria-hidden="true" />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
      <span className="summary-card__note">{note}</span>
    </article>
  );
}

function AffectedRequestCard({
  request,
  isUpdating,
  onEdit,
  onCancel
}: {
  request: EmergencyRequestRecord;
  isUpdating: boolean;
  onEdit: (request: EmergencyRequestRecord) => void;
  onCancel: (request: EmergencyRequestRecord) => void;
}) {
  const canChange = request.status === "submitted" || request.status === "under_review";
  return (
    <article className="request-card">
      <div className="request-card__top">
        <span className={`request-type-icon ${request.priority}`}>
          <Siren size={18} aria-hidden="true" />
        </span>
        <div>
          <span className={`status-badge request-${request.status}`}>
            {STATUS_LABELS[request.status]}
          </span>
          <h3>{ASSISTANCE_LABELS[request.assistanceType]}</h3>
        </div>
        <span className={`priority-badge ${request.priority}`}>
          {PRIORITY_LABELS[request.priority]}
        </span>
      </div>
      <p>{request.description}</p>
      <div className="request-meta">
        <span>
          <MapPin size={14} aria-hidden="true" />
          {request.location}
        </span>
        <span>
          <UsersRound size={14} aria-hidden="true" />
          {request.peopleAffected} people
        </span>
        <span>
          <Clock3 size={14} aria-hidden="true" />
          Updated {new Date(request.updatedAt).toLocaleDateString("en-MY")}
        </span>
      </div>
      {request.assignedTo ? (
        <div className="assignment-note">
          <UserCheck size={15} aria-hidden="true" />
          <span>
            Assigned to <strong>{request.assignedTo}</strong>
          </span>
        </div>
      ) : null}
      <RequestStatusTimeline request={request} />
      {canChange ? (
        <div className="request-actions">
          <button
            className="secondary-button"
            type="button"
            disabled={isUpdating}
            onClick={() => onEdit(request)}
          >
            <Edit3 size={15} aria-hidden="true" /> Update
          </button>
          <button
            className="text-button danger"
            type="button"
            disabled={isUpdating}
            onClick={() => onCancel(request)}
          >
            <Ban size={15} aria-hidden="true" /> Cancel
          </button>
        </div>
      ) : null}
    </article>
  );
}

function CoordinatorRequestCard({
  request,
  assignment,
  isUpdating,
  onAssignmentChange,
  onUpdate
}: {
  request: EmergencyRequestRecord;
  assignment: string;
  isUpdating: boolean;
  onAssignmentChange: (requestId: string, value: string) => void;
  onUpdate: (request: EmergencyRequestRecord, input: CoordinatorEmergencyUpdateInput) => void;
}) {
  const isClosed = request.status === "resolved" || request.status === "cancelled";
  return (
    <article className={`coordinator-case ${request.priority}`}>
      <div className="coordinator-case__header">
        <div>
          <span className={`status-badge request-${request.status}`}>
            {STATUS_LABELS[request.status]}
          </span>
          <h3>{request.requesterName}</h3>
          <p>
            {ASSISTANCE_LABELS[request.assistanceType]} · {request.peopleAffected} people
          </p>
        </div>
        <label className="priority-control">
          <span>Priority</span>
          <select
            value={request.priority}
            disabled={isClosed || isUpdating}
            onChange={(event) =>
              void onUpdate(request, { priority: event.target.value as EmergencyPriority })
            }
          >
            {EMERGENCY_PRIORITY_VALUES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="case-description">{request.description}</p>
      <div className="request-meta">
        <span>
          <MapPin size={14} aria-hidden="true" />
          {request.location}
        </span>
        <span>
          <Clock3 size={14} aria-hidden="true" />
          {new Date(request.createdAt).toLocaleString("en-MY", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </span>
      </div>
      {request.coordinatorNotes ? (
        <div className="coordinator-note">
          <ClipboardPen size={15} aria-hidden="true" />
          {request.coordinatorNotes}
        </div>
      ) : null}
      <RequestStatusTimeline request={request} compact />
      <div className="case-workflow">
        {request.status === "submitted" ? (
          <button
            className="secondary-button"
            type="button"
            disabled={isUpdating}
            onClick={() => void onUpdate(request, { status: "under_review" })}
          >
            <ClipboardCheck size={15} aria-hidden="true" /> Start review
          </button>
        ) : null}
        {request.status === "under_review" ? (
          <>
            <label className="assignment-field">
              <span className="sr-only">Responsible relief officer</span>
              <input
                minLength={2}
                maxLength={160}
                value={assignment}
                onChange={(event) => onAssignmentChange(request.id, event.target.value)}
                placeholder="Responsible officer or team"
              />
            </label>
            <button
              className="secondary-button"
              type="button"
              disabled={isUpdating || assignment.trim().length < 2}
              onClick={() =>
                void onUpdate(request, { status: "assigned", assignedTo: assignment.trim() })
              }
            >
              <UserCheck size={15} aria-hidden="true" /> Assign case
            </button>
          </>
        ) : null}
        {request.status === "assigned" ? (
          <button
            className="secondary-button"
            type="button"
            disabled={isUpdating}
            onClick={() => void onUpdate(request, { status: "in_progress" })}
          >
            <Siren size={15} aria-hidden="true" /> Start response
          </button>
        ) : null}
        {request.status === "in_progress" ? (
          <button
            className="secondary-button success"
            type="button"
            disabled={isUpdating}
            onClick={() => void onUpdate(request, { status: "resolved" })}
          >
            <CheckCircle2 size={15} aria-hidden="true" /> Resolve case
          </button>
        ) : null}
        {request.assignedTo ? (
          <span className="assigned-officer">
            <UserCheck size={14} aria-hidden="true" />
            {request.assignedTo}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function RequestStatusTimeline({
  request,
  compact = false
}: {
  request: EmergencyRequestRecord;
  compact?: boolean;
}) {
  return (
    <div
      className={`request-timeline ${compact ? "compact" : ""}`}
      aria-label="Request status history"
    >
      {request.statusHistory.map((event, index) => (
        <div className="request-timeline__event" key={`${event.status}-${event.occurredAt}`}>
          <span className="request-timeline__marker" aria-hidden="true">
            {index + 1}
          </span>
          <div>
            <strong>{STATUS_LABELS[event.status]}</strong>
            <small>
              {event.actor === "affected_user" ? "Affected user" : "Relief coordinator"} ·{" "}
              {new Date(event.occurredAt).toLocaleString("en-MY", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </small>
            {event.note ? <p>{event.note}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="state-panel compact">
      <Loader2 className="spin" size={26} aria-hidden="true" />
      <strong>{label}</strong>
    </div>
  );
}

function EmptyState({ label, text }: { label: string; text: string }) {
  return (
    <div className="state-panel compact">
      <CircleOff size={30} aria-hidden="true" />
      <strong>{label}</strong>
      <p>{text}</p>
    </div>
  );
}
