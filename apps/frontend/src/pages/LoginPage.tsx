import type { UserRole } from "@ddac/shared";

import {
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";

type LoginPageProps = {
  onLogin: (role: UserRole) => void;
};

export function LoginPage({
  onLogin,
}: LoginPageProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f1f5f9",
        padding: "20px",
      }}
    >
      <section
        style={{
          width: "min(500px, 100%)",
          background: "white",
          borderRadius: "10px",
          padding: "30px",
          boxShadow:
            "0 18px 50px rgba(25, 39, 52, 0.12)",
        }}
      >
        <p className="eyebrow">
          Disaster Relief Coordination System
        </p>

        <h1
          style={{
            color: "#0f172a",
            fontSize: "2rem",
          }}
        >
          Development Login
        </h1>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.6",
          }}
        >
          Select a role to test the
          role-based system. This will be
          replaced by the team's final
          authentication system.
        </p>

        <div
          style={{
            display: "grid",
            gap: "12px",
            marginTop: "22px",
          }}
        >
          <button
            className="primary-button"
            type="button"
            onClick={() =>
              onLogin("admin")
            }
          >
            <ShieldCheck size={18} />
            System Administrator
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={() =>
              onLogin(
                "reliefCoordinator"
              )
            }
          >
            <UserCog size={18} />
            Relief Coordinator
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={() =>
              onLogin("affectedUser")
            }
          >
            <Users size={18} />
            Affected User
          </button>
        </div>
      </section>
    </main>
  );
}