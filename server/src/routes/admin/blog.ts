import { Router } from "express";
import { z } from "zod";
import { BlogPost } from "../../models/BlogPost.js";
import { requireAuth } from "../../middleware/auth.js";

const blogSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  body: z.string().default(""),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  publishedAt: z.string().datetime().optional(),
});

export const adminBlogRouter = Router();
adminBlogRouter.use(requireAuth);

const formatPost = (p: any) => ({
  id: p._id.toString(),
  slug: p.slug,
  title: p.title,
  description: p.description,
  body: p.body,
  tags: p.tags,
  published: p.published,
  published_at: p.publishedAt,
  created_at: p.createdAt,
  updated_at: p.updatedAt,
});

adminBlogRouter.get("/", async (_req, res) => {
  try {
    const posts = await BlogPost.find().sort({ publishedAt: -1 });
    res.json({ posts: posts.map(formatPost) });
  } catch (err) {
    console.error("Admin get posts error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminBlogRouter.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ post: formatPost(post) });
  } catch (err) {
    console.error("Admin get post by id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminBlogRouter.post("/", async (req, res) => {
  const parsed = blogSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid post data", details: parsed.error.flatten() });
    return;
  }
  const p = parsed.data;
  try {
    const post = await BlogPost.create({
      slug: p.slug,
      title: p.title,
      description: p.description,
      body: p.body,
      tags: p.tags,
      published: p.published,
      publishedAt: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    });
    res.status(201).json({ post: formatPost(post) });
  } catch (err: any) {
    if (err && err.code === 11000) {
      res.status(409).json({ error: "Slug already exists" });
      return;
    }
    console.error("Admin post blog error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminBlogRouter.put("/:id", async (req, res) => {
  const parsed = blogSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid post data" });
    return;
  }
  const p = parsed.data;
  try {
    const updateData: any = {
      slug: p.slug,
      title: p.title,
      description: p.description,
      body: p.body,
      tags: p.tags,
      published: p.published,
      updatedAt: new Date(),
    };
    if (p.publishedAt) {
      updateData.publishedAt = new Date(p.publishedAt);
    }

    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ post: formatPost(post) });
  } catch (err: any) {
    if (err && err.code === 11000) {
      res.status(409).json({ error: "Slug already exists" });
      return;
    }
    console.error("Admin put blog error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminBlogRouter.delete("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Admin delete blog error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
