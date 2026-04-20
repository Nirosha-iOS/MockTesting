import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  const { isReady, isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("admin@lms.local");
  const [password, setPassword] = useState("ChangeMe!123");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isReady && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password, or the server is unreachable.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="crm-login">
      <aside className="crm-login-brand" aria-hidden>
        <div className="crm-login-brand-inner">
          <span className="crm-login-logo">LMS</span>
          <h1>Lead Operations Cloud</h1>
          <p>
            A unified workspace for lead intake, assignments, lifecycle visibility, and field coordination — all driven from one
            secure admin console.
          </p>
          <ul className="crm-login-highlights">
            <li>Role-aware navigation and record scope</li>
            <li>Pipeline, SLA, and campaign modules (roadmap)</li>
            <li>Shared design tokens across web and mobile</li>
          </ul>
        </div>
      </aside>
      <section className="crm-login-panel">
        <div className="crm-login-card">
          <header>
            <h2>Sign in</h2>
            <p>Use your organization email. Demo tenant credentials are pre-filled.</p>
          </header>
          {error ? <div className="error-banner">{error}</div> : null}
          <form className="crm-login-form" onSubmit={onSubmit}>
            <TextField label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button className="crm-login-submit" type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <footer className="crm-login-hint">
            <strong>Demo:</strong> admin@lms.local / ChangeMe!123 — configured in backend <code>application.yml</code>.
          </footer>
        </div>
      </section>
    </div>
  );
}
