import type { UserRole } from "@ddac/shared";

import { LogOut } from "lucide-react";
import { useState } from "react";

import { AdminLayout } from "./layouts/AdminLayout.js";
import { ReliefCoordinatorLayout } from "./layouts/ReliefCoordinatorLayout.js";
import { EmergencyWorkspace } from "./features/emergency-requests/EmergencyWorkspace.js";
import { LoginPage } from "./pages/LoginPage.js";

export function App() {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  function handleLogin(role: UserRole) {
    setCurrentRole(role);
  }

  function handleLogout() {
    setCurrentRole(null);
  }

  if (!currentRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <header className="session-bar">
        <div className="session-bar__content">
          <span className="session-bar__identity">
            Logged in as: <strong>{getRoleLabel(currentRole)}</strong>
          </span>

          <button className="session-bar__logout" type="button" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {currentRole === "admin" && <AdminLayout />}

      {currentRole === "reliefCoordinator" && <ReliefCoordinatorLayout />}

      {currentRole === "affectedUser" && <AffectedUserPortal />}
    </div>
  );
}

function getRoleLabel(role: UserRole) {
  if (role === "admin") {
    return "System Administrator";
  }

  if (role === "reliefCoordinator") {
    return "Relief Coordinator";
  }

  return "Affected User";
}

function AffectedUserPortal() {
  return <EmergencyWorkspace />;
}
