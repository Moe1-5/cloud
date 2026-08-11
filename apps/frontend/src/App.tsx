import type { CreateProjectInput, ProjectRecord, ProjectStatus } from "@ddac/shared";
import { PROJECT_STATUS_VALUES } from "@ddac/shared";
import { CheckCircle2, Cloud, Database, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject
} from "./api/projectsApi.js";

const initialFormState: CreateProjectInput = {
  title: "",
  description: "",
  ownerName: "",
  status: "planning"
};

const statusLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  completed: "Completed"
};

export function App() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [formState, setFormState] = useState<CreateProjectInput>(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeCount = useMemo(
    () => projects.filter((project) => project.status === "active").length,
    [projects]
  );

  async function refreshProjects() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const nextProjects = await listProjects();
      setProjects(nextProjects);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load projects.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshProjects();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const createdProject = await createProject(formState);
      setProjects((currentProjects) => [createdProject, ...currentProjects]);
      setFormState(initialFormState);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create project.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(project: ProjectRecord, status: ProjectStatus) {
    setErrorMessage(null);
    try {
      const updatedProject = await updateProject(project.id, { status });
      setProjects((currentProjects) =>
        currentProjects.map((item) => (item.id === project.id ? updatedProject : item))
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update project.");
    }
  }

  async function handleDelete(projectId: string) {
    setErrorMessage(null);
    try {
      await deleteProject(projectId);
      setProjects((currentProjects) => currentProjects.filter((project) => project.id !== projectId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete project.");
    }
  }

  return (
    <main className="app-shell">
      <section className="top-band">
        <div className="top-band__content">
          <div>
            <p className="eyebrow">AWS cloud application base</p>
            <h1>DDAC Project Workspace</h1>
            <p className="intro">
              Track project modules, owners, and implementation status while demonstrating
              DynamoDB create, read, update, and delete operations through a Node.js API.
            </p>
          </div>
          <div className="status-strip" aria-label="Project summary">
            <div>
              <span>{projects.length}</span>
              <small>Total records</small>
            </div>
            <div>
              <span>{activeCount}</span>
              <small>Active builds</small>
            </div>
          </div>
        </div>
      </section>

      <section className="workspace-grid" aria-label="Project management workspace">
        <form className="project-form" onSubmit={handleSubmit}>
          <div className="section-title">
            <Plus size={18} aria-hidden="true" />
            <h2>Add Module</h2>
          </div>

          <label>
            Title
            <input
              required
              minLength={3}
              maxLength={120}
              value={formState.title}
              onChange={(event) => setFormState({ ...formState, title: event.target.value })}
              placeholder="Backend API integration"
            />
          </label>

          <label>
            Owner
            <input
              required
              minLength={2}
              maxLength={120}
              value={formState.ownerName}
              onChange={(event) => setFormState({ ...formState, ownerName: event.target.value })}
              placeholder="Team member name"
            />
          </label>

          <label>
            Description
            <textarea
              required
              minLength={10}
              maxLength={1000}
              value={formState.description}
              onChange={(event) => setFormState({ ...formState, description: event.target.value })}
              placeholder="Describe the feature, database workflow, or frontend screen."
            />
          </label>

          <label>
            Status
            <select
              value={formState.status}
              onChange={(event) =>
                setFormState({ ...formState, status: event.target.value as ProjectStatus })
              }
            >
              {PROJECT_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="spin" size={18} aria-hidden="true" /> : <Plus size={18} />}
            Save record
          </button>
        </form>

        <section className="project-list" aria-live="polite">
          <div className="list-header">
            <div className="section-title">
              <Database size={18} aria-hidden="true" />
              <h2>DynamoDB Records</h2>
            </div>
            <button className="icon-button" type="button" onClick={refreshProjects} aria-label="Refresh records">
              <RefreshCw size={18} aria-hidden="true" />
            </button>
          </div>

          {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

          {isLoading ? (
            <div className="loading-state">
              <Loader2 className="spin" size={24} aria-hidden="true" />
              Loading records
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <Cloud size={32} aria-hidden="true" />
              <h3>No records yet</h3>
              <p>Create the first module to verify the full frontend, backend, and cloud database workflow.</p>
            </div>
          ) : (
            <div className="records">
              {projects.map((project) => (
                <article className="record-card" key={project.id}>
                  <div className="record-card__main">
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>
                    <button
                      className="icon-button danger"
                      type="button"
                      onClick={() => void handleDelete(project.id)}
                      aria-label={`Delete ${project.title}`}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="record-meta">
                    <span>{project.ownerName}</span>
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="segmented-control" aria-label={`Status for ${project.title}`}>
                    {PROJECT_STATUS_VALUES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={project.status === status ? "selected" : ""}
                        onClick={() => void handleStatusChange(project, status)}
                      >
                        {project.status === status ? <CheckCircle2 size={14} aria-hidden="true" /> : null}
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
