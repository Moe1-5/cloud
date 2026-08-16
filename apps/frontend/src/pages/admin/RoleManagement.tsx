import type { Permission, UserRole } from "@ddac/shared";

import { ROLE_PERMISSIONS, USER_ROLE_VALUES } from "@ddac/shared";

import { KeyRound, ShieldCheck, UserCog, Users } from "lucide-react";
import { RoleNavigation } from "../../layouts/RoleNavigation.js";

const roleLabels: Record<UserRole, string> = {
  admin: "System Administrator",
  reliefCoordinator: "Relief Coordinator",
  affectedUser: "Affected User"
};

const roleDescriptions: Record<UserRole, string> = {
  admin: "Controls user accounts, permissions, organisations, activity logs and system reports.",

  reliefCoordinator:
    "Manages operational disaster relief activities such as disaster information, shelters, services, victims, volunteers and resources.",

  affectedUser:
    "Views disaster information, manages their own profile and submits emergency assistance requests."
};

const permissionLabels: Record<Permission, string> = {
  manageUsers: "Manage User Accounts",
  manageRoles: "Manage Roles and Permissions",
  manageOrganisations: "Manage Relief Organisations",
  viewActivityLogs: "View System Activity Logs",
  viewSystemReports: "View System Reports",

  manageDisasters: "Manage Disaster Information",
  manageShelters: "Manage Shelters",
  manageReliefServices: "Manage Relief Services",
  manageVictims: "Manage Victims",
  manageVolunteers: "Manage Volunteers",
  manageResources: "Manage Resources",
  manageEmergencyRequests: "Manage Emergency Requests",

  viewDisasterInformation: "View Disaster Information",
  submitEmergencyRequest: "Submit Emergency Request",
  manageOwnProfile: "Manage Own Profile"
};

function getRoleIcon(role: UserRole) {
  if (role === "admin") {
    return <ShieldCheck size={26} />;
  }

  if (role === "reliefCoordinator") {
    return <UserCog size={26} />;
  }

  return <Users size={26} />;
}

export function RoleManagement() {
  return (
    <main className="app-shell">
      <section className="top-band">
        <div className="top-band__content">
          <div>
            <p className="eyebrow">Administration</p>

            <h1>Roles & Permissions</h1>

            <p className="intro">
              Review the permissions assigned to each system role and understand what areas of the
              Disaster Relief Coordination System each role can access.
            </p>
          </div>

          <div className="status-strip">
            <div>
              <span>{USER_ROLE_VALUES.length}</span>

              <small>System roles</small>
            </div>

            <div>
              <span>{Object.values(ROLE_PERMISSIONS).flat().length}</span>

              <small>Permission assignments</small>
            </div>
          </div>
        </div>
      </section>

      <RoleNavigation />

      <section className="admin-content admin-content--stack">
        <div
          className="project-list"
          style={{
            minHeight: "auto"
          }}
        >
          <div className="section-title">
            <KeyRound size={18} />
            <h2>System Access Roles</h2>
          </div>

          <p
            style={{
              marginTop: "12px",
              color: "#64748b",
              lineHeight: "1.6"
            }}
          >
            Roles are predefined for this system. Administrators assign one of these roles when
            creating or editing a user account.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px"
          }}
        >
          {USER_ROLE_VALUES.map((role) => {
            const permissions = ROLE_PERMISSIONS[role];

            return (
              <article
                key={role}
                className="record-card"
                style={{
                  background: "white",
                  boxShadow: "0 12px 35px rgba(25, 39, 52, 0.08)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "14px"
                  }}
                >
                  {getRoleIcon(role)}

                  <div>
                    <h3
                      style={{
                        marginBottom: "4px"
                      }}
                    >
                      {roleLabels[role]}
                    </h3>

                    <small
                      style={{
                        color: "#64748b"
                      }}
                    >
                      {role}
                    </small>
                  </div>
                </div>

                <p>{roleDescriptions[role]}</p>

                <div
                  style={{
                    borderTop: "1px solid #dbe4e7",
                    paddingTop: "14px",
                    marginTop: "14px"
                  }}
                >
                  <strong>Permissions</strong>

                  <div
                    style={{
                      marginTop: "10px",
                      display: "grid",
                      gap: "8px"
                    }}
                  >
                    {permissions.map((permission) => (
                      <div
                        key={permission}
                        style={{
                          border: "1px solid #dbe4e7",
                          borderRadius: "6px",
                          padding: "9px 10px",
                          background: "#f8fafc"
                        }}
                      >
                        {permissionLabels[permission]}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
