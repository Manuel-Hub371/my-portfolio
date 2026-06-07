/**
 * Browser: use same-origin `/api/*` (proxied by Next.js to the Express server).
 * Server: call Express directly via NEXT_PUBLIC_API_URL.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export async function parseJsonResponse(res: Response) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { error: text };
  }
}

export function fetchErrorMessage(err: unknown): string {
  if (err instanceof TypeError && err.message === "Failed to fetch") {
    return "Cannot reach the API. Start the server: cd server && npm run dev";
  }
  if (err instanceof Error) return err.message;
  return "Request failed";
}
