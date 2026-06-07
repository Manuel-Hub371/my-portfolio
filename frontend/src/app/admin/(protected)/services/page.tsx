"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminApi, type ServiceRow } from "@/lib/admin-api";

const empty = { title: "", description: "", icon: "code", sort_order: 0 };

const iconOptions = ["brain", "globe", "bot", "workflow", "eye", "code", "cpu", "layers", "zap", "shield"];

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await adminApi.getServices();
    setServices(data.services);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    try {
      if (editingId) {
        await adminApi.updateService(editingId, {
          title: form.title,
          description: form.description,
          icon: form.icon,
          sortOrder: form.sort_order,
        });
        setMessage("Service updated successfully.");
      } else {
        await adminApi.createService({
          title: form.title,
          description: form.description,
          icon: form.icon,
          sortOrder: form.sort_order,
        });
        setMessage("Service created successfully.");
      }
      setForm(empty);
      setEditingId(null);
      await load();
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : "Failed");
    }
  }

  function startEdit(s: ServiceRow) {
    setEditingId(s.id);
    setForm({
      title: s.title,
      description: s.description,
      icon: s.icon,
      sort_order: s.sort_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
    setMessage("");
  }

  async function remove(id: number) {
    if (!confirm("Permanently delete this service?")) return;
    await adminApi.deleteService(id);
    await load();
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Services</h1>
        <p className="admin-page-desc">Manage the services and offerings you provide to clients.</p>
      </div>

      {/* Form */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">
              {editingId ? "Edit service" : "Add service"}
            </div>
            <div className="admin-card-subtitle">
              {editingId ? "Update the service details below." : "Fill in the details to add a new service."}
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
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. AI Development"
                required
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Icon name</label>
              <select
                className="admin-input admin-select"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea
              className="admin-textarea prose"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what this service entails and the value it provides…"
              required
            />
          </div>

          <div className="admin-field" style={{ maxWidth: 120 }}>
            <label className="admin-label">Sort order</label>
            <input
              type="number"
              className="admin-input"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
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
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {editingId ? "Update service" : "Add service"}
            </button>
            {editingId && (
              <button type="button" className="admin-btn admin-btn-ghost" onClick={cancelEdit}>
                Discard changes
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Services list */}
      <div style={{ marginTop: 8 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
          All services
          <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-faint)", fontWeight: 400 }}>
            ({services.length})
          </span>
        </h2>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" /> Loading services…
          </div>
        ) : services.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">⚙️</div>
            <div className="admin-empty-text">No services yet</div>
            <div className="admin-empty-sub">Use the form above to add your first service.</div>
          </div>
        ) : (
          <ul className="admin-list">
            {services.map((s) => (
              <li key={s.id} className="admin-list-item">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "var(--accent-glow)",
                    border: "1px solid rgba(99,102,241,.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0,
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                  }}
                >
                  {s.icon.slice(0, 2)}
                </div>
                <div className="admin-list-item-body">
                  <div className="admin-list-item-title">{s.title}</div>
                  <div className="admin-list-item-meta">{s.description}</div>
                </div>
                <div className="admin-list-item-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    onClick={() => startEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => remove(s.id)}
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
