import type { AuthSession, UserAccountRecord } from "@ddac/shared";

import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

import { clearStoredAuthSession, getStoredAuthSession } from "./api/authSession.js";
import { AdminLayout } from "./layouts/AdminLayout.js";
import { ReliefCoordinatorLayout } from "./layouts/ReliefCoordinatorLayout.js";
import { EmergencyWorkspace } from "./features/emergency-requests/EmergencyWorkspace.js";
import { LoginPage } from "./pages/LoginPage.js";

const loginPath = "/login";

export function App() {
  const [currentUser, setCurrentUser] = useState<UserAccountRecord | null>(
    () => getStoredAuthSession()?.user ?? null
  );

  function handleLogin(session: AuthSession) {
    setCurrentUser(session.user);
    replacePath(getRoleHomePath(session.user));
  }

  function handleLogout() {
    clearStoredAuthSession();
    setCurrentUser(null);
    replacePath(loginPath);
  }

  useEffect(() => {
    if (!currentUser) {
      replacePath(loginPath);
      return;
    }

    if (window.location.pathname === loginPath) {
      replacePath(getRoleHomePath(currentUser));
    }
  }, [currentUser]);

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

function getRoleHomePath(user: UserAccountRecord): string {
  if (user.role === "admin") {
    return "/admin";
  }

  if (user.role === "reliefCoordinator") {
    return "/relief-coordinator";
  }

  return "/affected-user";
}

function replacePath(path: string): void {
  if (window.location.pathname !== path) {
    window.history.replaceState(null, "", path);
  }
}
