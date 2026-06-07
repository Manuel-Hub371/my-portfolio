import { Router } from "express";
import { z } from "zod";
import { Project } from "../../models/Project.js";
import { requireAuth } from "../../middleware/auth.js";

const projectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()).default([]),
  challenges: z.array(z.string()).default([]),
  results: z.array(z.string()).default([]),
  github: z.string().default(""),
  demo: z.string().default(""),
  image: z.string().default(""),
  sortOrder: z.number().int().optional(),
});

export const adminProjectsRouter = Router();
adminProjectsRouter.use(requireAuth);

const formatProject = (p: any) => ({
  id: p._id.toString(),
  slug: p.slug,
  name: p.name,
  description: p.description,
  technologies: p.technologies,
  challenges: p.challenges,
  results: p.results,
  github: p.github,
  demo: p.demo,
  image: p.image,
  sort_order: p.sortOrder,
  created_at: p.createdAt,
  updated_at: p.updatedAt,
});

adminProjectsRouter.get("/", async (_req, res) => {
  try {
    const projects = await Project.find().sort({ sortOrder: 1, _id: 1 });
    res.json({ projects: projects.map(formatProject) });
  } catch (err) {
    console.error("Admin get projects error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminProjectsRouter.post("/", async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid project data", details: parsed.error.flatten() });
    return;
  }
  const p = parsed.data;
  try {
    const project = await Project.create({
      slug: p.slug,
      name: p.name,
      description: p.description,
      technologies: p.technologies,
      challenges: p.challenges,
      results: p.results,
      github: p.github,
      demo: p.demo,
      image: p.image,
      sortOrder: p.sortOrder ?? 0,
    });
    res.status(201).json({ project: formatProject(project) });
  } catch (err: any) {
    if (err && err.code === 11000) {
      res.status(409).json({ error: "Project slug already exists" });
      return;
    }
    console.error("Admin post project error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminProjectsRouter.put("/:id", async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid project data" });
    return;
  }
  const p = parsed.data;
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        slug: p.slug,
        name: p.name,
        description: p.description,
        technologies: p.technologies,
        challenges: p.challenges,
        results: p.results,
        github: p.github,
        demo: p.demo,
        image: p.image,
        sortOrder: p.sortOrder ?? 0,
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json({ project: formatProject(project) });
  } catch (err: any) {
    if (err && err.code === 11000) {
      res.status(409).json({ error: "Project slug already exists" });
      return;
    }
    console.error("Admin put project error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminProjectsRouter.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Admin delete project error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
