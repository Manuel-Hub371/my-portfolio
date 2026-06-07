"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminApi, type BlogInput, type BlogRow } from "@/lib/admin-api";

const empty: BlogInput = {
  slug: "",
  title: "",
  description: "",
  body: "",
  tags: [],
  published: true,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [form, setForm] = useState(empty);
  const [tagsText, setTagsText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await adminApi.getBlogPosts();
    setPosts(data.posts);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    const payload: BlogInput = {
      ...form,
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await adminApi.updateBlogPost(editingId, payload);
        setMessage("Post updated successfully.");
      } else {
        await adminApi.createBlogPost(payload);
        setMessage("Post published successfully.");
      }
      setForm(empty);
      setTagsText("");
      setEditingId(null);
      await load();
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : "Failed");
    }
  }

  function startEdit(p: BlogRow) {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      title: p.title,
      description: p.description,
      body: p.body,
      tags: p.tags,
      published: p.published,
    });
    setTagsText(Array.isArray(p.tags) ? p.tags.join(", ") : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
    setTagsText("");
    setMessage("");
  }

  async function remove(id: number) {
    if (!confirm("Permanently delete this post?")) return;
    await adminApi.deleteBlogPost(id);
    await load();
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Blog</h1>
        <p className="admin-page-desc">Write and manage your posts and articles.</p>
      </div>

      {/* Form */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">
              {editingId ? "Edit post" : "New post"}
            </div>
            <div className="admin-card-subtitle">
              {editingId ? "Update the post details below." : "Fill in the details to publish a new post."}
            </div>
          </div>
          {editingId && (
            <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div className="admin-field">
              <label className="admin-label">Slug (URL path)</label>
              <input
                className="admin-input"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="my-post-title"
                required
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Tags (comma-separated)</label>
              <input
                className="admin-input"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="AI, Robotics, Tutorial"
              />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Title</label>
            <input
              className="admin-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Post title"
              required
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Description / excerpt</label>
            <textarea
              className="admin-textarea prose"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A short summary shown in listings and SEO…"
              required
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Body (Markdown)</label>
            <textarea
              className="admin-textarea"
              rows={14}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="## Introduction&#10;&#10;Write your post content here using Markdown…"
            />
          </div>

          <div className="admin-checkbox-row">
            <input
              id="published"
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            <label htmlFor="published">Publish immediately (uncheck to save as draft)</label>
          </div>

          {message && (
            <div className={`admin-alert ${isError ? "admin-alert-error" : "admin-alert-success"}`}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                {isError ? (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                )}
              </svg>
              {message}
            </div>
          )}

          <div className="admin-btn-row">
            <button type="submit" className="admin-btn">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
              </svg>
              {editingId ? "Update post" : "Publish post"}
            </button>
            {editingId && (
              <button type="button" className="admin-btn admin-btn-ghost" onClick={cancelEdit}>
                Discard changes
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Posts list */}
      <div style={{ marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
            All posts
            <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-faint)", fontWeight: 400 }}>
              ({posts.length})
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" /> Loading posts…
          </div>
        ) : posts.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">✍️</div>
            <div className="admin-empty-text">No posts yet</div>
            <div className="admin-empty-sub">Use the form above to publish your first post.</div>
          </div>
        ) : (
          <ul className="admin-list">
            {posts.map((p) => (
              <li key={p.id} className="admin-list-item">
                <div className="admin-list-item-body">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="admin-list-item-title">{p.title}</span>
                    <span className={`admin-badge ${p.published ? "admin-badge-green" : "admin-badge-amber"}`}>
                      {p.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <div className="admin-list-item-meta">
                    /{p.slug}
                    {Array.isArray(p.tags) && p.tags.length > 0 && (
                      <span style={{ marginLeft: 8 }}>
                        {p.tags.map((t) => (
                          <span key={t} className="admin-badge admin-badge-blue" style={{ marginRight: 4 }}>
                            {t}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
                <div className="admin-list-item-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    onClick={() => startEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => remove(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
