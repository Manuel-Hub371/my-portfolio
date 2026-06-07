import { Router } from "express";
import { PortfolioProfile } from "../models/PortfolioProfile.js";
import { Service } from "../models/Service.js";
import { Project } from "../models/Project.js";
import { BlogPost } from "../models/BlogPost.js";

export const contentRouter = Router();

contentRouter.get("/portfolio", async (_req, res) => {
  try {
    const profile = await PortfolioProfile.findOne();
    if (!profile) {
      res.status(404).json({ error: "Portfolio not configured" });
      return;
    }
    res.json({
      siteConfig: profile.siteConfig,
      aboutContent: profile.aboutContent,
    });
  } catch (err) {
    console.error("Get portfolio content error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

contentRouter.get("/services", async (_req, res) => {
  try {
    const services = await Service.find().sort({ sortOrder: 1, _id: 1 });
    // Keep backward compatible with the frontend expecting "id" and exact fields
    const formatted = services.map(s => ({
      id: s._id.toString(),
      title: s.title,
      description: s.description,
      icon: s.icon,
      sort_order: s.sortOrder,
    }));
    res.json({ services: formatted });
  } catch (err) {
    console.error("Get services error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

contentRouter.get("/projects", async (_req, res) => {
  try {
    const projects = await Project.find().sort({ sortOrder: 1, _id: 1 });
    res.json({
      projects: projects.map((p) => ({
        id: p.slug, // the client expects project.id to be the slug or used as the unique key
        name: p.name,
        description: p.description,
        technologies: p.technologies,
        challenges: p.challenges,
        results: p.results,
        github: p.github,
        demo: p.demo,
        image: p.image,
      })),
    });
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

contentRouter.get("/blog", async (_req, res) => {
  try {
    const posts = await BlogPost.find({ published: true }).sort({ publishedAt: -1 });
    res.json({
      posts: posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        tags: p.tags,
        date: p.publishedAt,
        url: `/blog/${p.slug}`,
      })),
    });
  } catch (err) {
    console.error("Get blog posts error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

contentRouter.get("/blog/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({
      slug: post.slug,
      title: post.title,
      description: post.description,
      body: post.body,
      tags: post.tags,
      date: post.publishedAt,
    });
  } catch (err) {
    console.error("Get blog post by slug error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
