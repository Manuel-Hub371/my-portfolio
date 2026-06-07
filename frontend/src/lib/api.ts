import { fetchErrorMessage, getApiBaseUrl } from "./api-base";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(payload: ContactPayload): Promise<void> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to submit contact form");
    }
  } catch (err) {
    throw new Error(fetchErrorMessage(err));
  }
}
