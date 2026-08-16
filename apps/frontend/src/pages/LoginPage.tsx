import type { AffectedUserRegisterInput, AuthSession, LoginInput } from "@ddac/shared";

import { Loader2, ShieldCheck, UserPlus } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { login, registerAffectedUser } from "../api/authApi.js";

type LoginPageProps = {
  onLogin: (session: AuthSession) => void;
};

type AuthMode = "login" | "register";

const emptyLoginForm: LoginInput = {
  email: "",
  password: ""
};

const emptyRegisterForm: AffectedUserRegisterInput = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  householdSize: 1,
  emergencyContact: ""
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<AuthMode>(() =>
    window.location.pathname === "/register" ? "register" : "login"
  );
  const [loginForm, setLoginForm] = useState<LoginInput>(emptyLoginForm);
  const [registerForm, setRegisterForm] = useState<AffectedUserRegisterInput>(emptyRegisterForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function selectMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrorMessage(null);
    window.history.replaceState(null, "", nextMode === "register" ? "/register" : "/login");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const session =
        mode === "login" ? await login(loginForm) : await registerAffectedUser(registerForm);
      onLogin(session);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to complete authentication."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className={`login-panel ${mode === "register" ? "login-panel--wide" : ""}`}>
        <div className="login-panel__intro">
          <span className="login-panel__mark" aria-hidden="true">
            {mode === "login" ? <ShieldCheck size={24} /> : <UserPlus size={24} />}
          </span>
          <div>
            <p className="eyebrow">Disaster Relief Coordination System</p>
            <h1>{mode === "login" ? "Sign in" : "Affected-user registration"}</h1>
          </div>
        </div>

        <p className="login-panel__copy">
          {mode === "login"
            ? "Use your assigned account to access the disaster relief coordination workspace."
            : "Create a community account to submit emergency requests and track assistance."}
        </p>

        <div className="login-mode-switch" aria-label="Authentication mode">
          <button
            className={mode === "login" ? "selected" : ""}
            type="button"
            onClick={() => selectMode("login")}
          >
            Sign in
          </button>
          <button
            className={mode === "register" ? "selected" : ""}
            type="button"
            onClick={() => selectMode("register")}
          >
            Register affected user
          </button>
        </div>

        <div className="auth-flow-note">
          <strong>Account flow:</strong> administrators create admin and relief coordinator
          accounts. Affected users can register themselves here.
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === "login" ? (
            <>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                  placeholder="admin@example.com"
                />
              </label>

              <label>
                Password
                <input
                  required
                  minLength={8}
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                  placeholder="Enter password"
                />
              </label>
            </>
          ) : (
            <div className="login-grid">
              <label>
                Full name
                <input
                  required
                  minLength={2}
                  maxLength={160}
                  value={registerForm.fullName}
                  onChange={(event) =>
                    setRegisterForm({ ...registerForm, fullName: event.target.value })
                  }
                  placeholder="Aisha Rahman"
                />
              </label>

              <label>
                Email
                <input
                  required
                  type="email"
                  maxLength={254}
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm({ ...registerForm, email: event.target.value })
                  }
                  placeholder="aisha@example.com"
                />
              </label>

              <label>
                Password
                <input
                  required
                  minLength={8}
                  maxLength={128}
                  type="password"
                  value={registerForm.password}
                  onChange={(event) =>
                    setRegisterForm({ ...registerForm, password: event.target.value })
                  }
                  placeholder="Minimum 8 characters"
                />
              </label>

              <label>
                Phone number
                <input
                  required
                  minLength={7}
                  maxLength={30}
                  value={registerForm.phone}
                  onChange={(event) =>
                    setRegisterForm({ ...registerForm, phone: event.target.value })
                  }
                  placeholder="+60 12-555 0142"
                />
              </label>

              <label>
                Household size
                <input
                  required
                  min={1}
                  max={100}
                  type="number"
                  value={registerForm.householdSize}
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,
                      householdSize: Number(event.target.value)
                    })
                  }
                />
              </label>

              <label>
                Emergency contact
                <input
                  required
                  minLength={7}
                  maxLength={160}
                  value={registerForm.emergencyContact}
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,
                      emergencyContact: event.target.value
                    })
                  }
                  placeholder="Name and phone number"
                />
              </label>

              <label className="full-span">
                Home address
                <input
                  required
                  minLength={5}
                  maxLength={300}
                  value={registerForm.address}
                  onChange={(event) =>
                    setRegisterForm({ ...registerForm, address: event.target.value })
                  }
                  placeholder="Taman Melawati, Kuala Lumpur"
                />
              </label>
            </div>
          )}

          {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="spin" size={18} />
            ) : mode === "login" ? (
              <ShieldCheck size={18} />
            ) : (
              <UserPlus size={18} />
            )}
            {isSubmitting
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
                ? "Sign in"
                : "Create affected-user account"}
          </button>
        </form>
      </section>
    </main>
  );
}
