import type { AuthSession, UserAccountRecord } from "@ddac/shared";

import { LogOut } from "lucide-react";
import { useState } from "react";

import { clearStoredAuthSession, getStoredAuthSession } from "./api/authSession.js";
import { AdminLayout } from "./layouts/AdminLayout.js";
import { ReliefCoordinatorLayout } from "./layouts/ReliefCoordinatorLayout.js";
import { EmergencyWorkspace } from "./features/emergency-requests/EmergencyWorkspace.js";
import { LoginPage } from "./pages/LoginPage.js";

export function App() {
  const [currentUser, setCurrentUser] = useState<UserAccountRecord | null>(
    () => getStoredAuthSession()?.user ?? null
  );

  function handleLogin(session: AuthSession) {
    setCurrentUser(session.user);
  }

  function handleLogout() {
    clearStoredAuthSession();
    setCurrentUser(null);
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const currentRole = currentUser.role;

  return (
    <div className="app-shell">
      <header className="session-bar">
        <div className="session-bar__content">
          <span className="session-bar__identity">
            Logged in as: <strong>{currentUser.fullName}</strong>
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

function AffectedUserPortal() {
  return <EmergencyWorkspace />;
}
