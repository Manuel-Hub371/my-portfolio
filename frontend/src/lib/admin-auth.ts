// We use sessionStorage rather than localStorage to hold the admin JWT token.
// This ensures the token is automatically wiped when the tab/browser is closed,
// preventing unauthorized persistent access on shared devices. All actual persistent
// application data (posts, projects, services) has been migrated to MongoDB.

const TOKEN_KEY = "portfolio_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

