import { getAdminToken } from "./admin-auth";
import { fetchErrorMessage, getApiBaseUrl, parseJsonResponse } from "./api-base";

async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  if (!token) throw new Error("Not authenticated");

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  } catch (err) {
    throw new Error(fetchErrorMessage(err));
  }

  const data = await parseJsonResponse(res);
  if (!res.ok) {
    throw new Error((data.error as string) ?? "Request failed");
  }
  return data as T;
}

export async function login(email: string, password: string) {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    throw new Error(fetchErrorMessage(err));
  }

  const data = await parseJsonResponse(res);
  if (!res.ok) {
    throw new Error((data.error as string) ?? "Login failed");
  }
  return data as { token: string; user: { id: string; email: string } };
}

export async function verifySession() {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await parseJsonResponse(res);
    return data.user as { id: string; email: string };
  } catch {
    return null;
  }
}

export const adminApi = {
  getPortfolio: () =>
    adminFetch<{ siteConfig: Record<string, unknown>; aboutContent: Record<string, unknown> }>(
      "/api/admin/portfolio"
    ),
  updatePortfolio: (body: { siteConfig: Record<string, unknown>; aboutContent: Record<string, unknown> }) =>
    adminFetch("/api/admin/portfolio", { method: "PUT", body: JSON.stringify(body) }),

  // Convenience: read just aboutContent, merge a patch, and save back
  async getAboutSections() {
    const data = await adminFetch<{ siteConfig: Record<string, unknown>; aboutContent: Record<string, unknown> }>("/api/admin/portfolio");
    const a = data.aboutContent as Record<string, unknown>;
    return {
      siteConfig: data.siteConfig,
      research:      (a.research      as ResearchItem[])      ?? [],
      certifications:(a.certifications as CertificationItem[]) ?? [],
      experience:    (a.experience    as ExperienceItem[])    ?? [],
      testimonials:  (a.testimonials  as TestimonialItem[])   ?? [],
      aboutContent:  a,
    };
  },
  async updateAboutSections(patch: {
    research?: ResearchItem[];
    certifications?: CertificationItem[];
    experience?: ExperienceItem[];
    testimonials?: TestimonialItem[];
  }) {
    const current = await adminFetch<{ siteConfig: Record<string, unknown>; aboutContent: Record<string, unknown> }>("/api/admin/portfolio");
    const merged = { ...current.aboutContent, ...patch };
    return adminFetch("/api/admin/portfolio", {
      method: "PUT",
      body: JSON.stringify({ siteConfig: current.siteConfig, aboutContent: merged }),
    });
  },

  getServices: () => adminFetch<{ services: ServiceRow[] }>("/api/admin/services"),
  createService: (body: { title: string; description: string; icon: string; sortOrder?: number }) =>
    adminFetch("/api/admin/services", { method: "POST", body: JSON.stringify(body) }),
  updateService: (
    id: number,
    body: { title: string; description: string; icon: string; sortOrder?: number }
  ) => adminFetch(`/api/admin/services/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteService: (id: number) => adminFetch(`/api/admin/services/${id}`, { method: "DELETE" }),

  getProjects: () => adminFetch<{ projects: ProjectRow[] }>("/api/admin/projects"),
  createProject: (body: ProjectInput) =>
    adminFetch("/api/admin/projects", { method: "POST", body: JSON.stringify(body) }),
  updateProject: (id: number, body: ProjectInput) =>
    adminFetch(`/api/admin/projects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProject: (id: number) => adminFetch(`/api/admin/projects/${id}`, { method: "DELETE" }),

  getBlogPosts: () => adminFetch<{ posts: BlogRow[] }>("/api/admin/blog"),
  getBlogPost: (id: number) => adminFetch<{ post: BlogRow }>(`/api/admin/blog/${id}`),
  createBlogPost: (body: BlogInput) =>
    adminFetch("/api/admin/blog", { method: "POST", body: JSON.stringify(body) }),
  updateBlogPost: (id: number, body: BlogInput) =>
    adminFetch(`/api/admin/blog/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteBlogPost: (id: number) => adminFetch(`/api/admin/blog/${id}`, { method: "DELETE" }),
};

export interface ServiceRow {
  id: number;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface ProjectRow {
  id: number;
  slug: string;
  name: string;
  description: string;
  technologies: string[];
  challenges: string[];
  results: string[];
  github: string;
  demo: string;
  image: string;
  sort_order: number;
}

export interface ProjectInput {
  slug: string;
  name: string;
  description: string;
  technologies: string[];
  challenges: string[];
  results: string[];
  github: string;
  demo: string;
  image: string;
  sortOrder?: number;
}

export interface BlogRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  published: boolean;
  published_at: string;
}

export interface BlogInput {
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  published: boolean;
}

/* ─── About sections ─────────────────────────────────────────────────────────── */
export interface ResearchItem {
  title: string;
  type: string;
  year: string;
  link: string;
  description: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  verifyUrl: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  responsibilities: string[];
  achievements: string[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}
