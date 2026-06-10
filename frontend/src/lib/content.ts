import { getApiBaseUrl } from "./api-base";
import { allPosts } from "contentlayer/generated";
import {
  siteConfig as fallbackSiteConfig,
  aboutContent as fallbackAboutContent,
  services as fallbackServices,
  featuredProjects as fallbackProjects,
} from "@/data/portfolio";

async function fetchJson<T>(path: string, timeout = 5000): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      signal: controller.signal,
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  location: string;
}

export interface AboutContent {
  intro: string;
  specialization: string;
  yearsExperience: string;
  expertise: string[];
  technologies: string[];
  goals: string;
}

export interface Project {
  id?: string;
  slug?: string;
  name: string;
  description: string;
  technologies: string[];
  challenges: string[];
  results: string[];
  github: string;
  demo: string;
  image: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  url: string;
}

export interface BlogPostFull extends BlogPostSummary {
  body: string;
}

export async function getPortfolio() {
  const data = await fetchJson<{ siteConfig: SiteConfig; aboutContent: AboutContent }>(
    "/api/content/portfolio"
  );
  if (!data) {
    return {
      siteConfig: fallbackSiteConfig,
      aboutContent: fallbackAboutContent,
    };
  }
  return {
    siteConfig: data.siteConfig,
    aboutContent: data.aboutContent,
  };
}

export async function getServices(): Promise<Service[]> {
  const data = await fetchJson<{ services: Array<Service & { sort_order?: number }> }>(
    "/api/content/services"
  );
  if (!data) {
    return fallbackServices;
  }
  return (data.services ?? []).map(({ title, description, icon }) => ({ title, description, icon }));
}

export async function getProjects(): Promise<Project[]> {
  const data = await fetchJson<{ projects: Project[] }>("/api/content/projects");
  if (!data) {
    return fallbackProjects;
  }
  return data.projects ?? [];
}

export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => (p as Project & { id?: string }).id === slug) ?? null;
}

const fallbackBlogPosts: BlogPostSummary[] = allPosts.map((post) => ({
  slug: post.slug,
  title: post.title,
  description: post.description,
  tags: post.tags,
  date: post.date as string,
  url: post.url,
})) as BlogPostSummary[];

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  const data = await fetchJson<{ posts: BlogPostSummary[] }>("/api/content/blog");
  return data?.posts ?? fallbackBlogPosts;
}

export async function getBlogPost(slug: string): Promise<BlogPostFull | null> {
  const data = await fetchJson<BlogPostFull>(`/api/content/blog/${slug}`);
  if (data) return data;

  const post = allPosts.find((item) => item.slug === slug);
  if (!post) return null;

  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags,
    date: post.date as string,
    url: post.url,
    body: post.body?.raw ?? "",
  };
}
