import type {
  CreateUserAccountWithPasswordInput,
  UserAccountRecord,
  UserRole,
  UserStatus
} from "@ddac/shared";

import { USER_ROLE_VALUES, USER_STATUS_VALUES } from "@ddac/shared";

import { Loader2, Pencil, Plus, RefreshCw, Trash2, UserCog, X } from "lucide-react";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import { createUser, deleteUser, listUsers, updateUser } from "../../api/usersApi.js";
import { RoleNavigation } from "../../layouts/RoleNavigation.js";

type UserForm = CreateUserAccountWithPasswordInput;

const initialForm: UserForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  role: "reliefCoordinator",
  status: "active",
  organisation: "",
  password: ""
};

const roleLabels: Record<UserRole, string> = {
  admin: "System Administrator",
  reliefCoordinator: "Relief Coordinator",
  affectedUser: "Affected User"
};

const statusLabels: Record<UserStatus, string> = {
  active: "Active",
  inactive: "Inactive"
};

export function UserManagement() {
  const [users, setUsers] = useState<UserAccountRecord[]>([]);

  const [form, setForm] = useState<UserForm>(initialForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeUsers = useMemo(
    () => users.filter((user) => user.status === "active").length,
    [users]
  );

  const adminUsers = useMemo(() => users.filter((user) => user.role === "admin").length, [users]);

  async function refreshUsers() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await listUsers();
      setUsers(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load users.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshUsers();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (editingId) {
        const { password, ...userInput } = form;
        const updated = await updateUser(editingId, {
          ...userInput,
          ...(password ? { password } : {})
        });

        setUsers((current) => current.map((user) => (user.id === editingId ? updated : user)));

        setEditingId(null);
      } else {
        const created = await createUser(form);

        setUsers((current) => [created, ...current]);
      }

      setForm(initialForm);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save user.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(user: UserAccountRecord) {
    setEditingId(user.id);

    setForm({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
      organisation: user.organisation,
      password: ""
    });

    window.scrollTo({
      top: 200,
      behavior: "smooth"
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleStatusChange(user: UserAccountRecord, status: UserStatus) {
    setErrorMessage(null);

    try {
      const updated = await updateUser(user.id, {
        status
      });

      setUsers((current) => current.map((item) => (item.id === user.id ? updated : item)));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update user.");
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Are you sure you want to delete this user account?");

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);

    try {
      await deleteUser(id);

      setUsers((current) => current.filter((user) => user.id !== id));

      if (editingId === id) {
        cancelEdit();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete user.");
    }
  }

  return (
    <main className="app-shell">
      <section className="top-band">
        <div className="top-band__content">
          <div>
            <p className="eyebrow">Administration</p>

            <h1>User Account Management</h1>

            <p className="intro">
              Create, update and manage system user accounts and assign appropriate roles.
            </p>
          </div>

          <div className="status-strip">
            <div>
              <span>{activeUsers}</span>
              <small>Active users</small>
            </div>

            <div>
              <span>{adminUsers}</span>
              <small>Administrators</small>
            </div>
          </div>
        </div>
      </section>

      <RoleNavigation />

      <section className="workspace-grid">
        <form className="project-form" onSubmit={handleSubmit}>
          <div className="section-title">
            {editingId ? <Pencil size={18} /> : <Plus size={18} />}

            <h2>{editingId ? "Edit User" : "Add User"}</h2>
          </div>

          <label>
            Full name
            <input
              required
              minLength={3}
              maxLength={150}
              value={form.fullName}
              onChange={(event) =>
                setForm({
                  ...form,
                  fullName: event.target.value
                })
              }
              placeholder="Ahmad Hassan"
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
                  email: event.target.value
                })
              }
              placeholder="ahmad@example.com"
            />
          </label>

          <label>
            Phone number
            <input
              required
              minLength={7}
              maxLength={30}
              value={form.phoneNumber}
              onChange={(event) =>
                setForm({
                  ...form,
                  phoneNumber: event.target.value
                })
              }
              placeholder="012-3456789"
            />
          </label>

          <label>
            Organisation
            <input
              required
              minLength={2}
              maxLength={150}
              value={form.organisation}
              onChange={(event) =>
                setForm({
                  ...form,
                  organisation: event.target.value
                })
              }
              placeholder="Malaysian Red Crescent"
            />
          </label>

          <label>
            {editingId ? "New password" : "Initial password"}
            <input
              required={!editingId}
              minLength={8}
              maxLength={128}
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({
                  ...form,
                  password: event.target.value
                })
              }
              placeholder={editingId ? "Leave blank to keep current password" : "At least 8 characters"}
            />
          </label>

          <label>
            Role
            <select
              value={form.role}
              onChange={(event) =>
                setForm({
                  ...form,
                  role: event.target.value as UserRole
                })
              }
            >
              {USER_ROLE_VALUES.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm({
                  ...form,
                  status: event.target.value as UserStatus
                })
              }
            >
              {USER_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="spin" size={18} />
            ) : editingId ? (
              <Pencil size={18} />
            ) : (
              <Plus size={18} />
            )}

            {isSaving ? "Saving..." : editingId ? "Update user" : "Add user"}
          </button>

          {editingId ? (
            <button
              type="button"
              className="icon-button"
              style={{
                width: "100%"
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
              <UserCog size={18} />

              <h2>User Accounts</h2>
            </div>

            <button className="icon-button" type="button" onClick={() => void refreshUsers()}>
              <RefreshCw size={18} />
            </button>
          </div>

          {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

          {isLoading ? (
            <div className="loading-state">
              <Loader2 className="spin" size={24} />
              Loading users
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <UserCog size={32} />

              <h3>No user accounts</h3>

              <p>Create the first system user account.</p>
            </div>
          ) : (
            <div className="records">
              {users.map((user) => (
                <article key={user.id} className="record-card">
                  <div className="record-card__main">
                    <div>
                      <h3>{user.fullName}</h3>

                      <p>{user.email}</p>
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
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        className="icon-button danger"
                        type="button"
                        onClick={() => void handleDelete(user.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="record-meta">
                    <span>{roleLabels[user.role]}</span>

                    <span>{user.organisation}</span>

                    <span>{user.phoneNumber}</span>

                    <span>{statusLabels[user.status]}</span>
                  </div>

                  <div className="segmented-control">
                    {USER_STATUS_VALUES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={user.status === status ? "selected" : ""}
                        onClick={() => void handleStatusChange(user, status)}
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
