import type { UserRole } from "@ddac/shared";

import { ShieldCheck, UserCog, Users } from "lucide-react";

type LoginPageProps = {
  onLogin: (role: UserRole) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-panel__intro">
          <span className="login-panel__mark" aria-hidden="true">
            <ShieldCheck size={24} />
          </span>
          <div>
            <p className="eyebrow">Disaster Relief Coordination System</p>
            <h1>Development Login</h1>
          </div>
        </div>

        <p className="login-panel__copy">
          Select a role to test the role-based system. This will be replaced by the team's final
          authentication system.
        </p>

        <div className="login-role-list">
          <button className="primary-button" type="button" onClick={() => onLogin("admin")}>
            <ShieldCheck size={18} />
            System Administrator
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={() => onLogin("reliefCoordinator")}
          >
            <UserCog size={18} />
            Relief Coordinator
          </button>

          <button className="primary-button" type="button" onClick={() => onLogin("affectedUser")}>
            <Users size={18} />
            Affected User
          </button>
        </div>
      </section>
    </main>
  );
}
