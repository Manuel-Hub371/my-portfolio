"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "@/lib/admin-api";
import { setAdminToken } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const { token } = await login(email, password);
      setAdminToken(token);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        {/* Logo */}
        <div className="admin-login-logo">
          <div className="admin-login-logo-icon">⚡</div>
          <div className="admin-login-logo-text">
            <h1>Admin Panel</h1>
            <p>Portfolio &amp; Blog CMS</p>
          </div>
        </div>

        <div className="admin-login-divider" />

        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              className="admin-input"
            />
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="admin-input"
            />
          </div>

          {error && (
            <div className="admin-alert admin-alert-error">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                Signing in…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Sign in
              </>
            )}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "var(--text-faint)" }}>
          Secure admin access only
        </p>
      </div>
    </div>
  );
}
