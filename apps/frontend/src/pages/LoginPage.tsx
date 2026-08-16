import type { AuthSession } from "@ddac/shared";

import { Loader2, ShieldCheck } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { login } from "../api/authApi.js";

type LoginPageProps = {
  onLogin: (session: AuthSession) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const session = await login({ email, password });
      onLogin(session);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <div className="login-panel__intro">
          <span className="login-panel__mark" aria-hidden="true">
            <ShieldCheck size={24} />
          </span>
          <div>
            <p className="eyebrow">Disaster Relief Coordination System</p>
            <h1>Sign in</h1>
          </div>
        </div>

        <p className="login-panel__copy">
          Use a system account to access the disaster relief coordination workspace.
        </p>

        <label>
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
          />
        </label>

        <label>
          Password
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
          />
        </label>

        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="spin" size={18} /> : <ShieldCheck size={18} />}
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
