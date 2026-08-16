import type {
  UserRole,
} from "@ddac/shared";

import { LogOut } from "lucide-react";
import { useState } from "react";

import { AdminLayout } from "./layouts/AdminLayout.js";
import { ReliefCoordinatorLayout } from "./layouts/ReliefCoordinatorLayout.js";
import { LoginPage } from "./pages/LoginPage.js";

export function App() {
  const [currentRole, setCurrentRole] =
    useState<UserRole | null>(null);

  function handleLogin(
    role: UserRole
  ) {
    setCurrentRole(role);
  }

  function handleLogout() {
    setCurrentRole(null);
  }

  if (!currentRole) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="app-shell">
      <div
        style={{
          background: "#020617",
          color: "white",
          padding: "8px 20px",
        }}
      >
        <div
          style={{
            width:
              "min(1180px, calc(100% - 20px))",

            margin: "0 auto",

            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            gap: "10px",

            flexWrap: "wrap",
          }}
        >
          <span>
            Logged in as:{" "}
            <strong>
              {getRoleLabel(
                currentRole
              )}
            </strong>
          </span>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              border: "none",
              borderRadius: "6px",
              padding: "7px 12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#334155",
              color: "white",
              cursor: "pointer",
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {currentRole === "admin" && (
        <AdminLayout />
      )}

      {currentRole ===
        "reliefCoordinator" && (
        <ReliefCoordinatorLayout />
      )}

      {currentRole ===
        "affectedUser" && (
        <AffectedUserPlaceholder />
      )}
    </div>
  );
}

function getRoleLabel(
  role: UserRole
) {
  if (role === "admin") {
    return "System Administrator";
  }

  if (
    role === "reliefCoordinator"
  ) {
    return "Relief Coordinator";
  }

  return "Affected User";
}

function AffectedUserPlaceholder() {
  return (
    <main>
      <section className="top-band">
        <div className="top-band__content">
          <div>
            <p className="eyebrow">
              Community Portal
            </p>

            <h1>
              Affected User Dashboard
            </h1>

            <p className="intro">
              The affected-user
              functionality will be
              integrated with the work
              developed by the responsible
              team member.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}