"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { adminApi, type ProjectInput, type ProjectRow } from "@/lib/admin-api";

const empty: ProjectInput = {
  slug: "", name: "", description: "",
  technologies: [], challenges: [], results: [],
  github: "", demo: "", image: "", sortOrder: 0,
};

/* ── helpers ── */
function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AlertIcon({ error }: { error: boolean }) {
  return error ? (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

/* ── Live preview card ── */
function PreviewCard({ form, techText }: { form: ProjectInput; techText: string }) {
  const techs = techText.split(",").map(t => t.trim()).filter(Boolean);
  const hasImage = !!form.image;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      {/* Banner */}
      <div style={{
        height: 120, background: "linear-gradient(135deg,#6366f1,#818cf8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {hasImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={form.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 900, color: "rgba(255,255,255,.8)" }}>
            {(form.name || "PRJ").split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          {form.name || "Project name"}
        </p>
        <p style={{ fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 10 }}
          className="admin-preview-desc">
          {form.description || "Project description will appear here…"}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {techs.slice(0, 4).map(t => (
            <span key={t} style={{ fontSize: 10, fontFamily: "monospace", padding: "2px 7px",
              borderRadius: 20, border: "1px solid rgba(99,102,241,.3)", background: "rgba(99,102,241,.1)", color: "#818cf8" }}>
              {t}
            </span>
          ))}
          {techs.length > 4 && (
            <span style={{ fontSize: 10, color: "var(--text-faint)" }}>+{techs.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Array field editor (challenges / results) ── */
function ArrayField({ label, items, onChange }: {
  label: string; items: string[]; onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }
  function handleKey(e: React.KeyboardEvent) { if (e.key === "Enter") { e.preventDefault(); add(); } }
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <input
          className="admin-input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder={`Add ${label.toLowerCase()} item and press Enter`}
          style={{ flex: 1 }}
        />
        <button type="button" className="admin-btn admin-btn-sm" style={{ marginTop: 0 }} onClick={add}>
          Add
        </button>
      </div>
      {items.length > 0 && (
        <ul style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {items.map((item, i) => (
            <li key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 8,
              background: "var(--bg-hover)", borderRadius: 6, padding: "7px 10px",
              fontSize: 12.5, color: "var(--text-muted)",
            }}>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{item}</span>
              <button type="button" onClick={() => remove(i)}
                style={{ background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-faint)", fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Delete confirm modal ── */
function DeleteModal({ project, onConfirm, onCancel }: {
  project: ProjectRow; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14,
        padding: 28, maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,.5)",
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🗑️</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
          Delete project?
        </h3>
        <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 20 }}>
          <strong style={{ color: "var(--text)" }}>{project.name}</strong> will be permanently removed.
          This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="admin-btn admin-btn-danger" style={{ flex: 1, justifyContent: "center" }} onClick={onConfirm}>
            Yes, delete
          </button>
          <button type="button" className="admin-btn admin-btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [form, setForm] = useState(empty);
  const [techText, setTechText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProjectRow | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "links">("basic");
  const formRef = useRef<HTMLDivElement>(null);

  async function load() {
    const data = await adminApi.getProjects();
    setProjects(data.projects);
    setLoading(false);
  }
  useEffect(() => { load().catch(console.error); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(""); setIsError(false); setSaving(true);
    const payload: ProjectInput = {
      ...form,
      technologies: techText.split(",").map(t => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await adminApi.updateProject(editingId, payload);
        setMessage("Project updated successfully.");
      } else {
        await adminApi.createProject(payload);
        setMessage("Project created successfully.");
      }
      setForm(empty); setTechText(""); setEditingId(null); setActiveTab("basic");
      await load();
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally { setSaving(false); }
  }

  function startEdit(p: ProjectRow) {
    setEditingId(p.id);
    setForm({
      slug: p.slug, name: p.name, description: p.description,
      technologies: p.technologies, challenges: p.challenges ?? [],
      results: p.results ?? [], github: p.github, demo: p.demo,
      image: p.image, sortOrder: p.sort_order,
    });
    setTechText(p.technologies.join(", "));
    setActiveTab("basic"); setMessage("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEdit() {
    setEditingId(null); setForm(empty); setTechText("");
    setMessage(""); setActiveTab("basic");
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await adminApi.deleteProject(deleteTarget.id);
    setDeleteTarget(null);
    await load();
  }

  function autoSlug(name: string) {
    if (!editingId && !form.slug) setForm(f => ({ ...f, slug: slugify(name) }));
  }

  const tabStyle = (t: string) => ({
    padding: "6px 14px", borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
    border: "none", background: activeTab === t ? "var(--accent)" : "transparent",
    color: activeTab === t ? "white" : "var(--text-muted)",
    transition: "background .15s, color .15s",
  } as React.CSSProperties);

  return (
    <>
      {deleteTarget && (
        <DeleteModal project={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}

      <div className="admin-page-header">
        <h1 className="admin-page-title">Projects</h1>
        <p className="admin-page-desc">
          {projects.length} project{projects.length !== 1 ? "s" : ""} · Add, edit, or remove your featured work.
        </p>
      </div>

      {/* ── Two-column layout: form + preview ── */}
      <div ref={formRef} style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>

        {/* Form card */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">{editingId ? "Edit project" : "New project"}</div>
              <div className="admin-card-subtitle">
                {editingId ? `Editing ID #${editingId}` : "Fill in the details below"}
              </div>
            </div>
            {editingId && (
              <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--bg-hover)", borderRadius: 8, padding: 4 }}>
            {(["basic", "details", "links"] as const).map(t => (
              <button key={t} type="button" style={tabStyle(t)} onClick={() => setActiveTab(t)}>
                {t === "basic" ? "Basic info" : t === "details" ? "Challenges & Results" : "Links & Media"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* ── Tab: Basic ── */}
            {activeTab === "basic" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <div className="admin-field">
                    <label className="admin-label">Project name *</label>
                    <input className="admin-input" value={form.name} required
                      placeholder="Smart Home Robot"
                      onChange={e => { setForm({ ...form, name: e.target.value }); autoSlug(e.target.value); }} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Slug (URL) *</label>
                    <input className="admin-input" value={form.slug} required
                      placeholder="smart-home-robot"
                      onChange={e => setForm({ ...form, slug: e.target.value })} />
                  </div>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Description *</label>
                  <textarea className="admin-textarea prose" rows={4} value={form.description} required
                    placeholder="What does this project do and why does it matter?"
                    onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Technologies (comma-separated)</label>
                  <input className="admin-input" value={techText}
                    placeholder="Python, React, PostgreSQL, Docker"
                    onChange={e => setTechText(e.target.value)} />
                  {techText && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                      {techText.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                        <span key={t} style={{ fontSize: 10.5, fontFamily: "monospace", padding: "2px 8px",
                          borderRadius: 20, border: "1px solid rgba(99,102,241,.3)",
                          background: "rgba(99,102,241,.1)", color: "#818cf8" }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="admin-field" style={{ maxWidth: 100 }}>
                  <label className="admin-label">Sort order</label>
                  <input type="number" className="admin-input" value={form.sortOrder}
                    onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} />
                </div>
              </>
            )}

            {/* ── Tab: Details ── */}
            {activeTab === "details" && (
              <>
                <ArrayField
                  label="Challenges"
                  items={form.challenges}
                  onChange={v => setForm({ ...form, challenges: v })}
                />
                <div className="admin-divider" />
                <ArrayField
                  label="Results / Outcomes"
                  items={form.results}
                  onChange={v => setForm({ ...form, results: v })}
                />
              </>
            )}

            {/* ── Tab: Links ── */}
            {activeTab === "links" && (
              <>
                <div className="admin-field">
                  <label className="admin-label">GitHub URL</label>
                  <input className="admin-input" value={form.github}
                    placeholder="https://github.com/user/repo"
                    onChange={e => setForm({ ...form, github: e.target.value })} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Live demo URL</label>
                  <input className="admin-input" value={form.demo}
                    placeholder="https://myproject.com"
                    onChange={e => setForm({ ...form, demo: e.target.value })} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Cover image URL</label>
                  <input className="admin-input" value={form.image}
                    placeholder="https://…/cover.png  or  /projects/my-project.svg"
                    onChange={e => setForm({ ...form, image: e.target.value })} />
                  {form.image && (
                    <div style={{ marginTop: 10, borderRadius: 8, overflow: "hidden",
                      border: "1px solid var(--border)", height: 100 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.image} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Feedback */}
            {message && (
              <div className={`admin-alert ${isError ? "admin-alert-error" : "admin-alert-success"}`}>
                <AlertIcon error={isError} />
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="admin-btn-row">
              <button type="submit" className="admin-btn" disabled={saving}>
                {saving ? (
                  <><div className="admin-spinner" style={{ width: 13, height: 13, borderWidth: 2 }} />
                  Saving…</>
                ) : (
                  <>{editingId ? "Update project" : "Add project"}</>
                )}
              </button>
              {editingId && (
                <button type="button" className="admin-btn admin-btn-ghost" onClick={cancelEdit}>
                  Discard
                </button>
              )}
              {!editingId && (form.name || form.description) && (
                <button type="button" className="admin-btn admin-btn-ghost" onClick={cancelEdit}>
                  Clear form
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Live preview */}
        <div style={{ position: "sticky", top: 80 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: ".06em", color: "var(--text-faint)", marginBottom: 10 }}>
            Live preview
          </p>
          <PreviewCard form={form} techText={techText} />
          <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8, textAlign: "center" }}>
            How it appears on the site
          </p>
        </div>
      </div>

      {/* ── Projects table ── */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
            All projects
            <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-faint)", fontWeight: 400 }}>
              ({projects.length})
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /> Loading projects…</div>
        ) : projects.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">🗂️</div>
            <div className="admin-empty-text">No projects yet</div>
            <div className="admin-empty-sub">Use the form above to add your first project.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {projects.map((p) => (
              <div key={p.id} style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 14,
                transition: "border-color .15s",
              }}>
                {/* Thumbnail */}
                <div style={{
                  width: 52, height: 52, borderRadius: 8, flexShrink: 0, overflow: "hidden",
                  background: "linear-gradient(135deg,#6366f1,#818cf8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,.8)" }}>
                      {p.name.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{p.name}</span>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-faint)" }}>/{p.slug}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                    {p.technologies.slice(0, 5).map(t => (
                      <span key={t} style={{ fontSize: 10, fontFamily: "monospace", padding: "1px 7px",
                        borderRadius: 20, border: "1px solid rgba(99,102,241,.25)",
                        background: "rgba(99,102,241,.08)", color: "#818cf8" }}>{t}</span>
                    ))}
                    {p.technologies.length > 5 && (
                      <span style={{ fontSize: 10, color: "var(--text-faint)" }}>+{p.technologies.length - 5}</span>
                    )}
                  </div>
                </div>

                {/* Stats pills */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                  {p.challenges?.length > 0 && (
                    <span style={{ fontSize: 10.5, padding: "2px 8px", borderRadius: 20,
                      background: "rgba(239,68,68,.1)", color: "#ef4444",
                      border: "1px solid rgba(239,68,68,.2)", whiteSpace: "nowrap" }}>
                      {p.challenges.length} challenges
                    </span>
                  )}
                  {p.results?.length > 0 && (
                    <span style={{ fontSize: 10.5, padding: "2px 8px", borderRadius: 20,
                      background: "rgba(34,197,94,.1)", color: "#22c55e",
                      border: "1px solid rgba(34,197,94,.2)", whiteSpace: "nowrap" }}>
                      {p.results.length} results
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteTarget(p)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
